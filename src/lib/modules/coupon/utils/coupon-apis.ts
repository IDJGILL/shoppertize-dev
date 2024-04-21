import { type AuthedTrpcContext } from "~/lib/trpc/trpc-context"
import { type ApplyCouponSchemaProps } from "./coupon-schemas"
import {
  adminQueryV2,
  userMutation,
  userQueryV2,
} from "~/lib/server/access/graphql"
import { apiResponse } from "~/lib/utils/functions/api-status"
import { CART_SESSION_DATA, GET_COUPON_BY_CODE } from "./coupon-graph"
import type { Coupon, SortedCoupon } from "./coupon-types"
import { formatPrice } from "~/lib/utils/functions/format-price"
import { UPDATE_CUSTOMER_SESSION } from "~/lib/server/api/auth/auth.gql"
import { meta } from "~/lib/utils/functions/meta"
import { sessionHelper } from "../../checkout/utils/checkout-apis"
import { getWalletBalance } from "~/lib/server/api/store/wallet/wallet.modules"

// Todo's
// Fix: Coupon code is being applied to gst excluded price.
// Fix: Coupon still applied even if coupon removed from backend of condition changed/not met.
// Fix: Apply and Remove text loader.
// Test: Check all conditions one by one.

export type CouponApiAction = "success" | "error"

type SessionData = {
  customer: {
    metaData: MetaData[]
    session: MetaData[]
  }
  cart: {
    contents: {
      nodes: CartSessionItem[]
    }
    appliedCoupons: AppliedCoupon[] | null
    availableShippingMethods: ShippingMethod[]
  }
}

export const applyCoupon = async (
  props: AuthedTrpcContext<ApplyCouponSchemaProps>,
) => {
  try {
    const {
      session: {
        authToken,
        user: { email },
      },
    } = props

    const requests = await Promise.all([
      userQueryV2<SessionData>({
        query: CART_SESSION_DATA,
        variables: {},
        authToken,
      }),

      adminQueryV2<{ coupon: Coupon }>({
        query: GET_COUPON_BY_CODE,
        variables: { id: props.input.code },
      }),

      getWalletBalance(email),
    ])

    const data = requests[0].data

    const couponsData = requests[1].data

    const walletBalance = requests[2]

    const metaData = data.customer.metaData

    const sessionData = data.customer.session

    const cartTotals = sessionHelper.cartTotals.from(sessionData)

    const usedCoupons = meta.usedCoupons.safeParse(metaData)

    const cartContents = data.cart.contents.nodes

    const coupon = couponsData.coupon

    let total = +cartTotals.total

    const isWalletApplied = sessionHelper.appliedWallet.from(sessionData)

    const walletAmount = Math.min(+cartTotals.subtotal, walletBalance)

    if (isWalletApplied) {
      total -= walletAmount
    }

    const eligibleCoupons = getCoupons({
      coupons: [coupon],
      usedCoupons,
      cartItems: cartContents,
      email,
      total,
    }).filter((a) => a.isEligible)

    const eligibleCoupon = eligibleCoupons[0]

    if (isWalletApplied && total === 0) {
      return apiResponse<null, CouponApiAction>({
        success: false,
        action: "error",
        message:
          "This coupon code can't applied, because there is no payable amount left",
      })
    }

    if (!!!eligibleCoupon) {
      return apiResponse<null, CouponApiAction>({
        success: false,
        action: "error",
        message: "This coupon code can't applied.",
      })
    }

    await userMutation({
      query: UPDATE_CUSTOMER_SESSION,
      variables: {
        sessionData: [
          {
            key: "applied_coupon",
            value: JSON.stringify(eligibleCoupon),
          },
        ],
      },
      authToken,
    })

    return apiResponse<null, CouponApiAction>({
      success: true,
      action: "success",
      message: "Coupon applied successfully",
      data: null,
    })
  } catch {
    return apiResponse<null, CouponApiAction>({
      success: false,
      action: "error",
      message: "This coupon code can't applied.",
    })
  }
}

export const removeCoupon = async (props: AuthedTrpcContext) => {
  try {
    await userMutation({
      query: UPDATE_CUSTOMER_SESSION,
      variables: {
        sessionData: [
          {
            key: "applied_coupon",
            value: JSON.stringify(null),
          },
        ],
      },
      authToken: props.session.authToken,
    })
  } catch {
    return apiResponse<null, CouponApiAction>({
      success: false,
      action: "error",
      message: "Something went wrong",
    })
  }
}

type GetCouponProps = {
  coupons: Coupon[]
  usedCoupons: UsedCoupon[] | null
  total: number
  cartItems: CartSessionItem[]
  email: string
}

export const getCoupons = (props: GetCouponProps) => {
  return props.coupons.reduce<SortedCoupon[]>((acc, coupon) => {
    const check = {
      expiry: !!coupon.dateExpiry,
      includedCategories: coupon.productCategories.nodes.length > 0,
      usageLimitPerUser: !!coupon.usageLimitPerUser,
      usageLimit: !!coupon.usageLimit,
      minimumAmount: !!coupon.minimumAmount,
      maximumAmount: !!coupon.maximumAmount,
      emailRestrictions: !!coupon.emailRestrictions,
    }

    if (check.expiry) {
      const isExpired =
        coupon.dateExpiry && new Date(coupon.dateExpiry) < new Date()

      if (isExpired) return acc
    }

    if (check.includedCategories) {
      const isIncludedCategories = props.cartItems.every((a) =>
        a.product.node.productCategories.nodes.some((b) =>
          coupon.productCategories.nodes.some((c) => c.slug === b.slug),
        ),
      )

      if (!isIncludedCategories) return acc
    }

    if (check.usageLimitPerUser) {
      const isUserUsageLimit =
        (props.usedCoupons ?? []).filter((item) => item.code === coupon.code)
          .length >= (coupon.usageLimitPerUser ?? 0)

      if (isUserUsageLimit) return acc
    }

    if (check.usageLimit) {
      const isCouponUsageLimit = coupon.usageCount >= (coupon.usageLimit ?? 0)

      if (isCouponUsageLimit) return acc
    }

    if (check.minimumAmount) {
      const isMinimumAmount = props.total < coupon.minimumAmount!

      if (isMinimumAmount) {
        acc.push({
          ...coupon,
          isEligible: false,
          eligibilityMessage: `You need to spend ₹${formatPrice({
            price: (coupon.minimumAmount! - props.total).toString(),
          })} more to unlock this offer.`,
        })

        return acc
      }
    }

    if (check.maximumAmount) {
      const isMaximumAmount = props.total > coupon.maximumAmount!

      if (isMaximumAmount) return acc
    }

    if (check.emailRestrictions) {
      const isEmailRestrictions = coupon.emailRestrictions!.includes(
        props.email,
      )

      if (!isEmailRestrictions) return acc
    }

    acc.push({ ...coupon, isEligible: true })

    return acc
  }, [])
}

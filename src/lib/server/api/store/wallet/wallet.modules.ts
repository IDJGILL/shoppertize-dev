import { userMutation, userQueryV2 } from "~/lib/server/access/graphql"
import { GET_CART_TOTAL } from "./wallet.gql"
import { UPDATE_CUSTOMER_SESSION } from "../../auth/auth.gql"
import metaFinder from "~/lib/utils/functions/meta-finder"
import { woocommerce } from "~/lib/server/access/woocommerce"
import { type Session } from "next-auth"
import { apiResponse } from "~/lib/utils/functions/api-status"
import { sessionHelper } from "~/lib/modules/checkout/router"
import { calculateCouponDiscount } from "../cart/cart.modules"
import { formatPrice } from "~/lib/utils/functions/format-price"

export type WalletAction = "success" | "error" | "applied_insufficient_balance"

const response = apiResponse<null, WalletAction>

export const applyWallet = async (session: Session) => {
  try {
    const requests = await Promise.all([
      userQueryV2<{
        customer: {
          session: MetaData[]
        }
      }>({
        query: GET_CART_TOTAL,
        variables: {},
        authToken: session.authToken,
      }),

      getWalletBalance(session.user.email),
    ])

    const walletBalance = requests[1]

    const sessionData = requests[0].data.customer.session

    const cartTotals = sessionHelper.cartTotals.from(sessionData)

    let total = +cartTotals.total

    const walletAmount = Math.min(+cartTotals.total, walletBalance)

    const appliedCoupon = sessionHelper.appliedCoupon.from(sessionData)

    const discount = calculateCouponDiscount(appliedCoupon, total)

    if (!!discount) {
      total -= discount.couponDiscount
    }

    if (!!discount && total === 0) {
      return response({
        success: false,
        action: "error",
        message:
          "Wallet can't be applied, because there is no payable amount left",
      })
    }

    await userMutation({
      query: UPDATE_CUSTOMER_SESSION,
      variables: {
        sessionData: [
          {
            key: "applied_wallet",
            value: JSON.stringify(true),
          },
        ],
      },
      authToken: session.authToken,
    })

    if (+total > walletBalance) {
      return response({
        success: true,
        message: `Insufficient balance, Please pay ${formatPrice({
          price: +total - walletBalance,
          prefix: "₹",
        })} more to complete the purchase.`,
        action: "applied_insufficient_balance",
        data: null,
      })
    }

    if (walletAmount === +cartTotals.total) {
      return response({
        success: true,
        message: `You can not pay full amount with your wallet, Please pay ${formatPrice(
          {
            price: cartTotals.total_tax,
            prefix: "₹",
          },
        )} to complete the purchase.`,
        action: "applied_insufficient_balance",
        data: null,
      })
    }

    return response({
      success: true,
      message: "Wallet applied",
      action: "success",
      data: null,
    })
  } catch {
    return response({
      success: false,
      message: "Something went wrong",
      action: "error",
    })
  }
}

export const removeWallet = async (authToken: string) => {
  try {
    await userQueryV2({
      query: UPDATE_CUSTOMER_SESSION,
      variables: {
        sessionData: [
          metaFinder.create.single({
            key: "applied_wallet",
            value: null,
          }),
        ],
      },
      authToken,
    })

    return response({
      success: true,
      message: "Wallet removed",
      action: "success",
      data: null,
    })
  } catch {
    return response({
      success: false,
      message: "Something went wrong",
      action: "error",
    })
  }
}

export const getWalletBalance = async (email: string) => {
  const response = await woocommerce<{ balance: string; currency: string }>(
    "GET",
    `wallet/balance?email=${email}`,
    undefined,
    "no-cache",
  )

  return +response.balance
}

export const getWallet = async (email: string) => {
  const wallet = await woocommerce<WalletTransaction[]>(
    "GET",
    `wallet?email=${email}`,
    undefined,
    "no-cache",
  )

  const walletBalance = +(wallet[0]?.balance ?? "0")

  const transactionHistory = wallet

  return {
    walletBalance,
    transactionHistory,
  }
}

export const debitWallet = async (email: string, amount: number) => {
  try {
    const response = await woocommerce<{ response: "success"; id: number }>(
      "POST",
      "wallet",
      {
        email,
        type: "debit",
        amount: amount,
        note: "Debited",
      },
      "no-cache",
    )

    if (response.response !== "success") return false

    return true
  } catch {
    return false
  }
}

export const creditWallet = async (email: string, amount: number) => {
  try {
    const response = await woocommerce<{ response: "success"; id: number }>(
      "POST",
      "wallet",
      {
        email,
        type: "credit",
        amount: amount,
        note: "Credit",
      },
      "no-cache",
    )

    if (response.response !== "success") return false

    return true
  } catch {
    return false
  }
}

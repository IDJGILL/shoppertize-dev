// import { adminQueryV2, userQueryV2 } from "~/lib/server/access/graphql"
// import {
//   summaryCalculator,
//   syncStore,
// } from "~/lib/server/api/store/cart/cart.modules"
// import { type AuthedTrpcContext } from "~/lib/trpc/trpc-context"
// import type {
//   CartLineItem,
//   CheckoutData,
//   CheckoutGuardProps,
//   CheckoutStatus,
//   SessionCartRecordItem,
//   SessionCartTotals,
//   SessionQueryData,
// } from "./checkout-types"
// import { SESSION_QUERY } from "./checkout-gql"
// import { GET_COUPONS } from "../coupon/utils/coupon-graph"
// import { getWalletBalance } from "~/lib/server/api/store/wallet/wallet.modules"
// import metaFinder from "~/lib/utils/functions/meta-finder"
// import { apiResponse } from "~/lib/utils/functions/api-status"
// import { getCoupons } from "../coupon/utils/coupon-apis"
// import type { MetaData, PlaceOrderAction } from "../order/utils/order-types"

// export const getSession = async (props: AuthedTrpcContext) => {
//   try {
//     const {
//       session: {
//         authToken,
//         user: { email },
//       },
//     } = props

//     await syncStore(authToken)

//     const requests = await Promise.all([
//       userQueryV2<SessionQueryData>({
//         query: SESSION_QUERY,
//         authToken,
//         variables: {},
//       }),

//       adminQueryV2<{ coupons: { nodes: CouponTodo[] } }>({
//         query: GET_COUPONS,
//         variables: {},
//       }),

//       getWalletBalance(email),
//     ])

//     const metaData = requests[0].data.customer.metaData

//     const sessionData = requests[0].data.customer.session

//     const cart = sessionHelper.cart.from(sessionData)

//     const cartTotals = sessionHelper.cartTotals.from(sessionData)

//     const cartContents = requests[0].data.cart.contents.nodes

//     const couponContents = requests[1].data.coupons.nodes

//     const shippingAddress = requests[0].data.customer.shipping

//     const pincode = requests[0].data.customer.shipping.postcode!

//     const usedCoupons = userMetaHelper.usedCoupons.from(metaData)

//     const isWalletApplied = sessionHelper.appliedWallet.from(sessionData)

//     const walletBalance = requests[2]

//     const appliedWalletBalance = isWalletApplied ? walletBalance : null

//     const appliedCoupon = sessionHelper.appliedCoupon.from(sessionData)

//     const isAllowed = checkoutGuard({ cart, cartContents, pincode })

//     if (!isAllowed) throw new Error()

//     const summary = summaryCalculator<OnlineSummary>({
//       type: "ONLINE",
//       cartContents: cartContents,
//       appliedCoupon: appliedCoupon,
//       appliedWalletBalance: appliedWalletBalance,
//       contentsTotal: cartTotals.cart_contents_total,
//       discountTotal: cartTotals.discount_total.toString(),
//       subtotal: cartTotals.subtotal,
//       total: cartTotals.total,
//       shippingTotal: "0",
//     })

//     const coupons = getCoupons({
//       coupons: couponContents,
//       usedCoupons,
//       total: summary.oldTotal,
//       cartItems: cartContents,
//       email,
//     })

//     const data = {
//       cartContents,
//       shippingAddress,
//       summary,
//       coupons,
//       walletBalance,
//       isWalletApplied,
//       cartTotals,
//     } satisfies CheckoutData

//     return apiResponse<CheckoutData, PlaceOrderAction>({
//       success: true,
//       data: data,
//       action: "success",
//       message: "Ready to checkout",
//     })
//   } catch {
//     return apiResponse<undefined, CheckoutStatus>({
//       success: false,
//       action: "OTHER_ERROR",
//       message: "Something went wrong",
//     })
//   }
// }

// function checkoutGuard(props: CheckoutGuardProps): boolean {
//   const isCartEmpty = props.cart.length === 0

//   if (isCartEmpty) return false

//   const isShippingRestricted = props.cartContents
//     .filter((a) => a.product.node.productSettings.allowedShippingPincodes)
//     .some(
//       (a) =>
//         !a.product.node.productSettings.allowedShippingPincodes
//           ?.split("\r\n")
//           .includes(props.pincode),
//     )

//   if (isShippingRestricted) return false

//   const isStockRestricted = props.cartContents.some(
//     (item) =>
//       item.product.node.stockStatus === "OUT_OF_STOCK" &&
//       item.product.node.stockQuantity === 0,
//   )

//   if (isStockRestricted) return false

//   const isOverStockRestricted = props.cartContents.some(
//     (item) => item.quantity > item.product.node.stockQuantity,
//   )

//   if (isOverStockRestricted) return false

//   return true
// }

// export const sessionHelper = {
//   cart: {
//     from: (sessionData: MetaData[]) => {
//       const items = metaFinder.safeParse<Record<string, SessionCartRecordItem>>(
//         {
//           key: "cart",
//           metaData: sessionData,
//         },
//       )

//       if (!!!items) throw new Error()

//       const values = Object.values(items)

//       const lineItems: CartLineItem[] = values.map((a) => ({
//         product_id: a.product_id,
//         quantity: a.quantity,
//         ...(a.variation ? { variation_id: a.variation_id } : {}),
//       }))

//       return lineItems
//     },
//   },

//   cartTotals: {
//     from: (sessionData: MetaData[]) => {
//       const totals = metaFinder.safeParse<SessionCartTotals>({
//         key: "cart_totals",
//         metaData: sessionData,
//       })

//       if (!totals) throw new Error()

//       return totals
//     },
//   },

//   appliedCoupon: {
//     from: (sessionData: MetaData[]) => {
//       return metaFinder.safeParse<CouponTodo>({
//         key: "applied_coupon",
//         metaData: sessionData,
//       })
//     },
//   },

//   appliedWallet: {
//     from: (sessionData: MetaData[]) => {
//       return (
//         metaFinder.safeParse<boolean>({
//           key: "applied_wallet",
//           metaData: sessionData,
//         }) ?? false
//       )
//     },
//   },
// }

// export const userMetaHelper = {
//   usedCoupons: {
//     from: (metaData: MetaData[]) => {
//       const usedCoupons = metaFinder.safeParse<UsedCoupon[]>({
//         key: "used_coupons",
//         metaData: metaData,
//       })

//       if (!!!usedCoupons || usedCoupons.length === 0) return null

//       return usedCoupons
//     },
//     add: (data: { old: UsedCoupon[]; new: UsedCoupon }): MetaData => {
//       return metaFinder.create.single({
//         key: "used_coupons",
//         value: [...data.old, data.new],
//       })
//     },
//   },
// }

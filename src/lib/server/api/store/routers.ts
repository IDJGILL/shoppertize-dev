import { createTRPCRouter } from "~/lib/trpc/trpc-instance"
import { cartRouter } from "./cart/cart.router"
import { productRouter } from "./product/product.router"
import { addressRouter } from "./address/address.routers"
import { walletRouter } from "./wallet/wallet.router"
import { orderRouter } from "./order/order.router"
import { paymentRouter } from "./payment/payment.router"
import { couponRoutes } from "~/lib/modules/coupon/utils/coupon-api-routes"

export const storeRouter = createTRPCRouter({
  product: productRouter,
  cart: cartRouter,
  wallet: walletRouter,
  payment: paymentRouter,
  address: addressRouter,
  order: orderRouter,
  coupon: couponRoutes,
})

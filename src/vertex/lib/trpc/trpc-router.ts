import { vertexAuthRouter } from "~/vertex/modules/auth/auth-trpc"
import { createTRPCRouter } from "./trpc-config"
import { carouselRouter } from "~/lib/modules/carousel/utils/carousel-apis"
import { testRouter } from "~/vertex/modules/test-router"
import { cartRouter } from "~/vertex/modules/cart/cart-trpc"

export const appRouter = createTRPCRouter({
  vertexAuth: vertexAuthRouter,
  carousel: carouselRouter,
  test: testRouter,
  cart: cartRouter,
})

export type AppRouter = typeof appRouter

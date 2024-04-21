import { vertexAuthRouter } from "~/vertex/modules/auth/auth-trpc"
import { createTRPCRouter } from "./trpc-init"
import { carouselRouter } from "~/lib/modules/carousel/utils/carousel-apis"

export const appRouter = createTRPCRouter({
  vertexAuth: vertexAuthRouter,
  carousel: carouselRouter,
})

export type AppRouter = typeof appRouter

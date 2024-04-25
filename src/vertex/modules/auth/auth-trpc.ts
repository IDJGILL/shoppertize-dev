import { createTRPCRouter, publicProcedure } from "~/vertex/lib/trpc/trpc-config"

export const vertexAuthRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user
  }),
})

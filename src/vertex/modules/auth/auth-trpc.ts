import { createTRPCRouter, publicProcedure } from "~/vertex/lib/trpc/trpc-init"

export const vertexAuthRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user
  }),
})

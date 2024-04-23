import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/vertex/lib/trpc/trpc-init"
import { getAddressOptions } from "./address/address-queries"

export const testRouter = createTRPCRouter({
  public: publicProcedure.mutation(() => {
    return
  }),

  protected: protectedProcedure.mutation(async ({ ctx }) => {
    return await getAddressOptions(ctx.session.authToken)
  }),
})

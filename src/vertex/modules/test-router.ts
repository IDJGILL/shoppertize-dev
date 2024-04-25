import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/vertex/lib/trpc/trpc-config"

export const testRouter = createTRPCRouter({
  public: publicProcedure.mutation(() => {
    return
  }),

  protected: protectedProcedure.mutation(({ ctx }) => {
    return
  }),
})

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/vertex/lib/trpc/trpc-config"
import { seedCoupons } from "./coupon/coupon-server-utils"

export const testRouter = createTRPCRouter({
  public: publicProcedure.mutation(async () => {
    await seedCoupons()
  }),

  protected: protectedProcedure.mutation(({ ctx }) => {
    return
  }),
})

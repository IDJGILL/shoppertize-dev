import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import { ApplyCouponSchema } from "./coupon-schemas"
import { applyCoupon, removeCoupon } from "./coupon-apis"

export const couponRoutes = createTRPCRouter({
  apply: protectedProcedure
    .input(ApplyCouponSchema)
    .mutation(async ({ ctx, input }) => {
      return await applyCoupon({ ...ctx, input })
    }),

  remove: protectedProcedure.mutation(async ({ ctx, input }) => {
    return await removeCoupon({ ...ctx, input })
  }),
})

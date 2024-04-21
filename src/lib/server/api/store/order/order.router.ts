import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/lib/trpc/trpc-instance"
import { InfiniteOrdersSchema } from "~/lib/modules/order/utils/order-schemas"
import {
  getInfiniteOrders,
  getOrderById,
} from "~/lib/modules/order/utils/order-apis"
import { z } from "zod"
import { verifyOrderConfirmation } from "./order.modules"

export const orderRouter = createTRPCRouter({
  getInfiniteOrders: protectedProcedure
    .input(InfiniteOrdersSchema)
    .query(async ({ input, ctx }) => {
      return await getInfiniteOrders({ ...ctx, input })
    }),

  getOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getOrderById(input)
    }),

  verifyOrderConfirmation: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await verifyOrderConfirmation(input)
    }),
})

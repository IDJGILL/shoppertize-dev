import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import { checkout } from "./checkout-methods"
import { z } from "zod"

export const checkoutRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => await checkout.get(ctx)),

  handle: protectedProcedure
    .input(z.object({ paymentMethod: z.enum(["ONLINE", "WALLET", "COD"]) }))
    .mutation(
      async ({ ctx, input }) =>
        await checkout.handle({
          session: ctx.session,
          paymentMethod: input.paymentMethod,
        }),
    ),
})

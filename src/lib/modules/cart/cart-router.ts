import { add, count, get, remove, update } from "./cart-methods"
import { CartItemRecordSchema } from "./cart-schemas"
import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"

export const cartRouter = createTRPCRouter({
  get: publicProcedure.query(get),

  add: publicProcedure.input(CartItemRecordSchema).mutation(add),

  update: publicProcedure.input(CartItemRecordSchema).mutation(update),

  remove: publicProcedure.input(CartItemRecordSchema).mutation(remove),

  count: publicProcedure.query(count),
})

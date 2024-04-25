import { createTRPCRouter, publicProcedure } from "~/vertex/lib/trpc/trpc-config"
import { $CartItem } from "./cart-schemas"
import { addItemToCart, getCartItemsCount } from "./cart-controllers"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { TRPCError } from "@trpc/server"

// Todo - Create a callback wrapper for trpc resolving ExtendedError class to TRPCError

export const cartRouter = createTRPCRouter({
  add: publicProcedure.input($CartItem).mutation(async ({ input }) => {
    try {
      await addItemToCart(input)
    } catch (error) {
      if (error instanceof ExtendedError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        })
      }
    }
  }),

  count: publicProcedure.query(async () => await getCartItemsCount()),
})

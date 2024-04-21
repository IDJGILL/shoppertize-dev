import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"
import {
  AddToCartDTO,
  RemoveItemDTO,
  ReplaceItemDTO,
  UpdateQuantityDTO,
} from "./cart.dtos"
import {
  addToCart,
  getCart,
  getCartIndicator,
  removeCartItems,
  switchVariation,
  updateQuantity,
} from "./cart.modules"

export const cartRouter = createTRPCRouter({
  getCart: publicProcedure.query(async ({ ctx }) => {
    return await getCart(ctx)
  }),

  switchVariation: publicProcedure
    .input(ReplaceItemDTO)
    .mutation(async ({ ctx, input }) => {
      return await switchVariation({ ...ctx, ...input })
    }),

  addToCart: publicProcedure
    .input(AddToCartDTO)
    .mutation(async ({ ctx, input }) => {
      return await addToCart({ ...ctx, ...input })
    }),

  updateQuantity: publicProcedure
    .input(UpdateQuantityDTO)
    .mutation(async ({ ctx, input }) => {
      return await updateQuantity({ ...ctx, ...input })
    }),

  removeCartItems: publicProcedure
    .input(RemoveItemDTO)
    .mutation(async ({ ctx, input }) => {
      return await removeCartItems({ ...ctx, ...input })
    }),

  getCartIndicator: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return await getCartIndicator({ isLoggedIn: false })
    }

    return await getCartIndicator({
      isLoggedIn: true,
      authToken: ctx.session.authToken,
    })
  }),
})

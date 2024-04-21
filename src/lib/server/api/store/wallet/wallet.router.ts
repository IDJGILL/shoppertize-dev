import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import {
  applyWallet,
  getWalletBalance,
  getWallet,
  removeWallet,
} from "./wallet.modules"
import { WalletActionSchema } from "./wallet.dtos"

export const walletRouter = createTRPCRouter({
  applyOrRemove: protectedProcedure
    .input(WalletActionSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.action === "apply") {
        return await applyWallet(ctx.session)
      }

      return await removeWallet(ctx.session.authToken)
    }),

  getWalletBalance: protectedProcedure.query(async ({ ctx }) => {
    return await getWalletBalance(ctx.session.user.email)
  }),

  getWallet: protectedProcedure.query(async ({ ctx }) => {
    return await getWallet(ctx.session.user.email)
  }),
})

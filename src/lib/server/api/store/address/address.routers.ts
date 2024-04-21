import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import { z } from "zod"
import {
  AddressSchema,
  checkPincodeSchema,
} from "~/lib/modules/address/utils/address-schemas"
import {
  addressHandler,
  checkPincode,
  getAddressClientSide,
  resendOtp,
} from "~/lib/modules/address/utils/address-apis"

export const addressRouter = createTRPCRouter({
  addressHandler: protectedProcedure
    .input(AddressSchema)
    .mutation(async ({ input, ctx }) => {
      return await addressHandler({ ...ctx, input: input })
    }),

  checkPincode: protectedProcedure
    .input(checkPincodeSchema)
    .mutation(async ({ input }) => {
      return await checkPincode(input)
    }),

  resendOtp: protectedProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await resendOtp(input.token)
    }),

  getAddress: protectedProcedure.query(async ({ ctx }) => {
    return await getAddressClientSide(ctx.session.authToken)
  }),
})

import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import { address } from "./address-methods"
import { AddressSchema } from "./address-schemas"
import { findState } from "~/lib/utils/functions/find-state-by-value"
import { z } from "zod"

export const addressRouter = createTRPCRouter({
  getShippingAddress: protectedProcedure.query(
    async ({ ctx }) =>
      await address.get.shipping({ authToken: ctx.session.authToken }),
  ),

  getBothAddress: protectedProcedure.query(
    async ({ ctx }) =>
      await address.get.both({ authToken: ctx.session.authToken }),
  ),

  updateBothAddress: protectedProcedure.input(AddressSchema).mutation(
    async ({ ctx, input }) =>
      await address.method.update.both({
        authToken: ctx.session.authToken,
        both: {
          shipping: {
            firstName: input.shipping_firstName,
            lastName: input.shipping_lastName,
            address1: input.shipping_address1,
            address2: input.shipping_address2,
            phone: input.shipping_phone,
            postcode: input.shipping_postcode,
            city: input.shipping_city,
            state:
              findState({
                valueType: "name",
                returnType: "code",
                value: input.shipping_state,
              }) ?? "",
            country: "IN",
            otp: input.shipping_otp,
            token: input.shipping_token,
            email: "none@gmail.com",
          },

          billing: input.gstInvoice
            ? {
                firstName: input.billing_firstName,
                lastName: "",
                address1: input.billing_address1,
                address2: input.billing_address2,
                phone: input.billing_phone,
                postcode: input.billing_postcode,
                city: input.billing_city,
                state:
                  findState({
                    valueType: "name",
                    returnType: "code",
                    value: input.billing_state,
                  }) ?? "",
                country: "IN",
                email: "none@gmail.com",
                company: input.billing_gst,
              }
            : undefined,
        },
      }),
  ),

  resendOtp: protectedProcedure
    .input(z.string())
    .mutation(
      async ({ input }) => await address.method.otp.resend({ token: input }),
    ),
})

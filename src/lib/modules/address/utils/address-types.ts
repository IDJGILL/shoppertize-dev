import { type GetBothAddressesGqlResponse } from "./address-gql"
import { type WrapTRPCSuccess } from "~/lib/trpc/trpc-instance"

export type AddressMethods = {
  method: {
    update: {
      /**
       * Updates shipping address and verifies phone number.
       * @throws `BAD_REQUEST` Phone verification error messages.
       * @returns `null` if phone not changed or `{ token: string }` if changed and need to verify.
       */
      shipping: (props: {
        authToken: string
        address: RemoveNullable<ShippingAddress> & {
          otp?: string
          token?: string
        }
      }) => Promise<WrapTRPCSuccess<{ token: string } | null, "none">>

      /**
       * Updates billing address.
       */
      billing: (props: {
        authToken: string
        address: RemoveNullable<BillingAddress>
      }) => Promise<WrapTRPCSuccess<null, "none">>

      /**
       * Updates shipping and billing address and verifies phone number of shipping address.
       * @throws `BAD_REQUEST` Phone verification error messages.
       * @returns `null` if phone not changed or `{ token: string }` if changed and need to verify.
       */
      both: (props: {
        authToken: string
        both: {
          shipping: RemoveNullable<ShippingAddress> & {
            otp?: string
            token?: string
          }
          billing?: RemoveNullable<BillingAddress>
        }
      }) => Promise<WrapTRPCSuccess<{ token: string } | null, "none">>
    }

    otp: {
      /**
       * Resend's the otp and return new Token.
       * @throws `BAD_REQUEST` Phone verification error messages.
       */
      resend: (props: {
        token: string
      }) => Promise<WrapTRPCSuccess<{ token: string }, "none">>
    }
  }

  get: {
    shipping: (props: { authToken: string }) => Promise<ShippingAddress>

    billing: (props: { authToken: string }) => Promise<BillingAddress>

    both: (props: {
      authToken: string
    }) => Promise<{ shipping: ShippingAddress; billing: BillingAddress }>
  }

  update: {
    shipping: (props: {
      authToken: string
      address: RemoveNullable<ShippingAddress>
    }) => Promise<void>

    billing: (props: {
      authToken: string
      address: RemoveNullable<BillingAddress>
    }) => Promise<void>

    both: (props: {
      authToken: string
      both: {
        shipping: RemoveNullable<ShippingAddress>
        billing: RemoveNullable<BillingAddress>
      }
    }) => Promise<void>
  }
}

export type ShippingAddress =
  GetBothAddressesGqlResponse["customer"]["shipping"]

export type BillingAddress = GetBothAddressesGqlResponse["customer"]["billing"]

export type OrderAddresses = {
  shipping: RemoveNullable<ShippingAddress>
  billing?: RemoveNullable<BillingAddress>
}

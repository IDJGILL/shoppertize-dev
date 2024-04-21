import { wrapTRPC } from "~/lib/trpc/trpc-instance"
import type { AddressMethods } from "./address-types"
import { client } from "~/lib/graphql/client"
import {
  GetBothAddressesGql,
  UpdateBothAddressGql,
  GetBillingAddressGql,
  GetShippingAddressGql,
  UpdateBillingAddressGql,
  UpdateShippingAddressGql,
  type GetBillingAddressGqlResponse,
  type GetShippingAddressGqlResponse,
  type GetBothAddressesGqlResponse,
  type UpdateShippingAddressGqlInput,
  type UpdateBillingAddressGqlInput,
  type UpdateBothAddressInput,
} from "./address-gql"
import otpless from "~/lib/utils/functions/otpless"
import { findState } from "~/lib/utils/functions/find-state-by-value"

export const address: AddressMethods = {
  method: {
    update: {
      shipping: async (props: Parameters<AddressMethods["method"]["update"]["shipping"]>[number]) => {
        return wrapTRPC(async (response) => {
          const { authToken } = props

          const currentShippingAddress = await address.get.shipping({
            authToken,
          })

          if (props.address.token) {
            if (!props.address.otp) {
              throw new ExtendedError({
                code: "BAD_REQUEST",
                message: "Please enter otp",
              })
            }

            const verify = await otpless.verify(props.address.token, props.address.otp)

            if (!verify.success) {
              throw new ExtendedError({
                code: "BAD_REQUEST",
                message: verify.message,
              })
            }

            await address.update.shipping(props)

            return response.success({
              action: "none",
              data: null,
            })
          }

          if (currentShippingAddress.phone !== props.address.phone) {
            const smsDetails = await otpless.send(props.address.phone)

            return response.success({
              action: "none",
              message: "Your need to verify your phone number.",
              data: { token: smsDetails.token },
            })
          }

          await address.update.shipping(props)

          return response.success({
            action: "none",
            data: null,
          })
        })
      },

      billing: async (props: Parameters<AddressMethods["method"]["update"]["billing"]>[number]) => {
        return wrapTRPC(async (response) => {
          await address.update.billing(props)

          return response.success({
            action: "none",
            data: null,
          })
        })
      },

      both: async (props: Parameters<AddressMethods["method"]["update"]["both"]>[number]) => {
        return wrapTRPC(async (response) => {
          const requests = await Promise.all([
            address.method.update.shipping({
              authToken: props.authToken,
              address: props.both.shipping,
            }),
            ...[
              props.both.billing
                ? address.update.billing({
                    authToken: props.authToken,
                    address: props.both.billing,
                  })
                : undefined,
            ],
          ])

          const token = requests[0].data?.token

          return response.success({
            action: "none",
            data: token ? { token } : null,
          })
        })
      },
    },

    otp: {
      resend: async (props: Parameters<AddressMethods["method"]["otp"]["resend"]>[number]) => {
        return wrapTRPC(async (response) => {
          const request = await otpless.resend(props.token)

          if (!request.newToken) {
            throw new ExtendedError({
              code: "BAD_REQUEST",
              message: request.message,
            })
          }

          return response.success({
            action: "none",
            data: {
              token: request.newToken,
            },
          })
        })
      },
    },
  },

  get: {
    shipping: async (props: Parameters<AddressMethods["get"]["shipping"]>[number]) => {
      const data = await client<GetShippingAddressGqlResponse>({
        access: "user",
        query: GetShippingAddressGql,
        authToken: props.authToken,
      })

      return {
        ...data.customer.shipping,
        state: findState({
          type: "code",
          return: "name",
          value: data.customer.shipping.state ?? "",
        }),
      }
    },

    billing: async (props: Parameters<AddressMethods["get"]["billing"]>[number]) => {
      const data = await client<GetBillingAddressGqlResponse>({
        access: "user",
        query: GetBillingAddressGql,
        authToken: props.authToken,
      })

      return {
        ...data.customer.billing,
        state: findState({
          type: "code",
          return: "name",
          value: data.customer.billing.state ?? "",
        }),
      }
    },

    both: async (props: Parameters<AddressMethods["get"]["both"]>[number]) => {
      const data = await client<GetBothAddressesGqlResponse>({
        access: "user",
        query: GetBothAddressesGql,
        authToken: props.authToken,
      })

      return {
        shipping: {
          ...data.customer.shipping,
          state: findState({
            type: "code",
            return: "name",
            value: data.customer.shipping.state ?? "",
          }),
        },

        billing: {
          ...data.customer.billing,
          state: findState({
            type: "code",
            return: "name",
            value: data.customer.billing.state ?? "",
          }),
        },
      }
    },
  },

  update: {
    shipping: async (props: Parameters<AddressMethods["update"]["shipping"]>[number]) => {
      await client<
        unknown,
        {
          shipping: UpdateShippingAddressGqlInput["shipping"] & {
            otp: undefined
            token: undefined
          }
        }
      >({
        access: "user",
        query: UpdateShippingAddressGql,
        inputs: {
          shipping: { ...props.address, otp: undefined, token: undefined },
        },
        authToken: props.authToken,
      })
    },

    billing: async (props: Parameters<AddressMethods["update"]["billing"]>[number]) => {
      await client<unknown, UpdateBillingAddressGqlInput>({
        access: "user",
        query: UpdateBillingAddressGql,
        inputs: {
          billing: props.address,
        },
        authToken: props.authToken,
      })
    },

    both: async (props: Parameters<AddressMethods["update"]["both"]>[number]) => {
      await client<unknown, UpdateBothAddressInput>({
        access: "user",
        query: UpdateBothAddressGql,
        inputs: props.both,
        authToken: props.authToken,
      })
    },
  },
}

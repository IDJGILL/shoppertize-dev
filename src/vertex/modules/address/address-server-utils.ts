import "server-only"

import { type Shipping } from "./address-models"
import { client } from "~/lib/graphql/client"
import {
  UpdateUserMetaDataGql,
  type UpdateUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlResponse,
} from "./address-gql"
import type { VerifyAddress, AddressSession } from "./address-types"
import { redisCreate, redisGet } from "~/vertex/lib/redis/redis-utils"
import otpless from "~/vertex/lib/otpless/otpless-config"
import { nanoid } from "nanoid"

export async function updateAddressMetaData(props: { list: Shipping[]; item: Shipping; authToken: string }) {
  await client<UpdateUserMetaDataGqlResponse, UpdateUserMetaDataGqlInput>({
    access: "user",
    query: UpdateUserMetaDataGql,
    inputs: {
      key: "address-options",
      metaData: [{ key: "address-options", value: JSON.stringify(props.list) }],
    },
    authToken: props.authToken,
  })
}

export async function sendAddressOtp(input: Shipping, action: VerifyAddress["action"]): Promise<string> {
  const response1 = await otpless.send(input.phone)

  const response2 = await redisCreate<VerifyAddress>({
    idPrefix: "@verify/address",
    payload: { action: action, address: { ...input, id: nanoid() }, token: response1.token },
    ttlSec: 5 * 60,
  })

  return response2.id
}

export const getAddressOptions = async (uid: string) => {
  const session = await redisGet<AddressSession>({ id: uid, idPrefix: "@session/address" })

  return (session?.options ?? []).sort((a, b) => (a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1))
}

export const getCurrentAddress = async (uid: string) => {
  const options = await getAddressOptions(uid)

  return options.find((a) => a.isSelected)
}

// export async function addAddress(props: AddAddress) {
//   const input = cloneDeep(props.input)

//   const options = cloneDeep(props.options)

//   if (options.length === 0) {
//     return await redisCreate<AddressSession>({
//       id: props.uid,
//       idPrefix: "@session/address",
//       payload: { options: [{ ...input, isSelected: true, isDefault: true }] },
//     })
//   }

//   if (input.isDefault) {
//     options.forEach((address) => {
//       if (address.id !== input.id) {
//         address.isDefault = false
//       }
//     })
//   }

//   if (input.isSelected) {
//     options.forEach((address) => {
//       if (address.id !== input.id) {
//         address.isSelected = false
//       }
//     })
//   }

//   const hasDefaultAddress = props.options.some((a) => a.isDefault)

//   if (!hasDefaultAddress) {
//     input.isDefault = true
//   }

//   const existingAddressIndex = options.findIndex((address) => address.id === input.id)

//   if (existingAddressIndex !== -1) {
//     options[existingAddressIndex] = input
//   } else {
//     options.push(input)
//   }

//   console.log({ options })

//   await redisUpdate<AddressSession>({
//     id: props.uid,
//     idPrefix: "@session/address",
//     payload: { options },
//   })
// }

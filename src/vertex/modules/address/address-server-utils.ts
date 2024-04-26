import "server-only"

import { type Shipping } from "./address-models"
import { client } from "~/lib/graphql/client"
import {
  GetUserMetaDataGql,
  UpdateUserMetaDataGql,
  type GetUserMetaDataGqlResponse,
  type GetUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlResponse,
} from "./address-gql"
import type { AddressSession, AddOrUpdateAddress } from "./address-types"
import { redisCreate, redisUpdate } from "~/vertex/lib/redis/redis-utils"
import type { AuthSession } from "~/vertex/global/global-types"
import { cloneDeep } from "lodash-es"
import otpless from "~/vertex/lib/otpless/otpless-config"
import { nanoid } from "nanoid"

export async function updateAddressMetaData(props: { list: Shipping[]; item: Shipping; authToken: string }) {
  const isDefault = props.item.isDefault

  const metaDataItems = [
    { key: "address-options", value: JSON.stringify(props.list) },
    { key: "address-selected", value: JSON.stringify(props.item) },
    {
      key: "address-default",
      value: isDefault ? JSON.stringify(props.item) : "",
    },
  ] satisfies MetaData[]

  console.log("metaDataItems", JSON.stringify(metaDataItems))

  await client<UpdateUserMetaDataGqlResponse, UpdateUserMetaDataGqlInput>({
    access: "user",
    query: UpdateUserMetaDataGql,
    inputs: {
      key: "address-options",
      metaData: metaDataItems,
    },
    authToken: props.authToken,
  })
}

export async function sendAddressOtp(input: Shipping, action: AddressSession["action"]): Promise<string> {
  const response1 = await otpless.send(input.phone)

  const response2 = await redisCreate<AddressSession>({
    idPrefix: "@session/address",
    payload: { action: action, address: { ...input, id: nanoid() }, token: response1.token },
    ttlSec: 5 * 60,
  })

  return response2.id
}

export async function addOrUpdateAddress(props: AddOrUpdateAddress) {
  const addressInput = cloneDeep(props.address)

  const addressOptions = cloneDeep(props.addresses)

  if (addressInput.isDefault) {
    addressOptions.forEach((address) => {
      if (address.id !== addressInput.id) {
        address.isDefault = false
      }
    })
  } else {
    const hasDefaultAddress = props.addresses.some((a) => a.isDefault)

    if (!hasDefaultAddress) {
      addressInput.isDefault = true
    }
  }

  const existingAddressIndex = addressOptions.findIndex((address) => address.id === addressInput.id)

  if (existingAddressIndex !== -1) {
    addressOptions[existingAddressIndex] = addressInput
  } else {
    addressOptions.push(addressInput)
  }

  await Promise.all([
    updateAddressMetaData({ list: addressOptions, item: addressInput, authToken: props.authToken }),
    redisUpdate<AuthSession>({ id: props.uid, idPrefix: "@session/auth", payload: { currentAddress: addressInput } }),
  ])
}

export const getAddressOptionsFromMeta = async (authToken: string) => {
  const data = await client<GetUserMetaDataGqlResponse, Omit<GetUserMetaDataGqlInput, "customerId">>({
    query: GetUserMetaDataGql,
    access: "user",
    inputs: {
      keysIn: ["address-options"],
    },
    authToken,
  })

  const metaData = data.customer.metaData?.find((a) => a.key === "address-options")

  if (!metaData) return { email: data.customer.email!, uid: data.customer.databaseId.toString(), addresses: [] }

  const addresses = JSON.parse(metaData.value) as Shipping[]

  return {
    addresses,
    email: data.customer.email!,
    uid: data.customer.databaseId.toString(),
  }
}

export const getCurrentAddressFromMeta = async (customerId: number) => {
  const data = await client<GetUserMetaDataGqlResponse, GetUserMetaDataGqlInput>({
    query: GetUserMetaDataGql,
    access: "admin",
    inputs: {
      keysIn: ["address-selected", "address-default"],
      customerId,
    },
  })

  const defaultAddress = data.customer.metaData?.find((a) => a.key === "address-default")

  const selectedAddress = data.customer.metaData?.find((a) => a.key === "address-selected")

  if (selectedAddress) {
    return JSON.parse(selectedAddress.value) as Shipping | null
  }

  if (defaultAddress) {
    return JSON.parse(defaultAddress.value) as Shipping | null
  }

  return null
}

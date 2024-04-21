import "server-only"

import { client } from "~/lib/graphql/client"
import {
  GetUserMetaDataGql,
  type GetUserMetaDataGqlInput,
  type GetUserMetaDataGqlResponse,
} from "~/lib/modules/auth/auth-gql"
import type { AddressDataItem } from "./address-types"

export const getAddressOptions = async (customerId: number) => {
  const data = await client<
    GetUserMetaDataGqlResponse,
    GetUserMetaDataGqlInput
  >({
    query: GetUserMetaDataGql,
    access: "admin",
    inputs: {
      keysIn: ["address-options"],
      customerId,
    },
  })

  const metaData = data.customer.metaData?.find(
    (a) => a.key === "address-options",
  )

  if (!metaData) return []

  const addresses = JSON.parse(metaData.value) as AddressDataItem[]

  return addresses
}

export const getCurrentAddress = async (customerId: number) => {
  const data = await client<
    GetUserMetaDataGqlResponse,
    GetUserMetaDataGqlInput
  >({
    query: GetUserMetaDataGql,
    access: "admin",
    inputs: {
      keysIn: ["address-selected", "address-default"],
      customerId,
    },
  })

  const defaultAddress = data.customer.metaData?.find(
    (a) => a.key === "address-default",
  )

  const selectedAddress = data.customer.metaData?.find(
    (a) => a.key === "address-selected",
  )

  if (selectedAddress) {
    return JSON.parse(selectedAddress.value) as AddressDataItem | null
  }

  if (defaultAddress) {
    return JSON.parse(defaultAddress.value) as AddressDataItem | null
  }

  return null
}

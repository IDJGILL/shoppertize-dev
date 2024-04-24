import "server-only"

import { client } from "~/lib/graphql/client"
import {
  GetUserMetaDataGql,
  type GetUserMetaDataGqlInput,
  type GetUserMetaDataGqlResponse,
} from "~/lib/modules/auth/auth-gql"
import type { AddressData } from "./address-types"

export const getAddressOptions = async (authToken: string) => {
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

  const addresses = JSON.parse(metaData.value) as AddressData[]

  return {
    addresses,
    email: data.customer.email!,
    uid: data.customer.databaseId.toString(),
  }
}

export const getCurrentAddressFromDb = async (customerId: number) => {
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
    return JSON.parse(selectedAddress.value) as AddressData | null
  }

  if (defaultAddress) {
    return JSON.parse(defaultAddress.value) as AddressData | null
  }

  return null
}

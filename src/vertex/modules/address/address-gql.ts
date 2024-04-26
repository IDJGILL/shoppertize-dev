import type { PickDataFields, PickInputFields } from "~/vertex/global/global-types"

export const GetUserMetaDataGql = `
query GetUserMetaDataGql($keysIn: [String] = []) {
  customer {
    email
    databaseId
    metaData(keysIn: $keysIn, multiple: true) {
      key
      value
    }
  }
  allowedCountries
}
`

export type GetUserMetaDataGqlResponse = {
  customer: {
    metaData: PickDataFields<"metaData">["metaData"] | null
  } & PickDataFields<"email" | "databaseId">
  allowedCountries: string[]
}

export type GetUserMetaDataGqlInput = PickInputFields<"keysIn" | "customerId">

export const UpdateUserMetaDataGql = `
mutation UpdateUserMetaDataGql($metaData: [MetaDataInput] = {key: "", value: ""}, $key: String = "") {
  updateCustomer(input: {metaData: $metaData}) {
    customer {
      metaData(key: $key) {
        key
        value
      }
    }
  }
}
`

export type UpdateUserMetaDataGqlResponse = {
  updateCustomer: {
    customer: PickDataFields<"metaData">
  }
}

export type UpdateUserMetaDataGqlInput = PickInputFields<"metaData" | "key">

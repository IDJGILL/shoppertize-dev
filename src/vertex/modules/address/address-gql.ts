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
    metaData: Pick<GqlDataProps, "metaData">["metaData"] | null
  } & Pick<GqlDataProps, "email" | "databaseId">
  allowedCountries: string[]
}

export type GetUserMetaDataGqlInput = {
  keysIn: string[]
  customerId: number
}

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
    customer: Pick<GqlDataProps, "metaData">
  }
}

export type UpdateUserMetaDataGqlInput = Pick<GqlInputProps, "metaData" | "key">

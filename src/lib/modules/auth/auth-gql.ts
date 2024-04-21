export const UserByIdGql = `
query UserByIdGql($idType: UserNodeIdTypeEnum = DATABASE_ID, $id: ID = "") {
  user(id: $id, idType: $idType) {
    databaseId
    firstName
    lastName
    email
    userMetaData {
      emailVerification
      phoneVerification
    }
  }
}
`

export type UserByIdGqlData = {
  user: Pick<
    GqlDataProps,
    "databaseId" | "firstName" | "lastName" | "email" | "userMetaData"
  >
}

export type UserByIdGqlInput = Pick<GqlInputProps, "id" | "idType">

export const RefreshAccessTokenGql = `
mutation RefreshAccessTokenGql($refreshToken: String = "") {
  refreshToken(input: {refreshToken: $refreshToken}) {
    authToken
  }
}
`

export type RefreshAccessTokenGqlData = {
  refreshToken: Pick<GqlDataProps, "authToken">
}

export type RefreshAccessTokenGqlInput = Pick<GqlInputProps, "refreshToken">

export const PasswordLoginGql = `
mutation PasswordLoginGql($credentials: PasswordProviderResponseInput = {username: "", password: ""}) {
  login(input: {provider: PASSWORD, credentials: $credentials}) {
    authToken
    refreshToken
    user {
      databaseId
      name
      email
    }
  }
}
`

export type PasswordLoginGqlData = {
  login: Pick<GqlDataProps, "authToken" | "refreshToken"> & {
    user: Pick<GqlDataProps, "databaseId" | "name" | "email">
  }
}

export type PasswordLoginGqlInput = {
  credentials: Pick<GqlInputProps, "username" | "password">
}

export const UserMetaGql = `
query UserMetaGql($key: String) {
  customer(customerId: $customerId) {
    databaseId
    email
    metaData(key: $key) {
      key
      value
    }
  }
}
`

export type UserMetaGqlData = {
  customer: Pick<GqlDataProps, "databaseId" | "email" | "metaData">
}

export type UserMetaGqlInput = Pick<GqlInputProps, "key">

export const GetAuthTokensGql = `
mutation GetAuthTokensGql($identity: String = "") {
  login(input: {provider: SITETOKEN, identity: $identity}) {
    authToken
    refreshToken
    user {
      databaseId
      name
      email
    }
  }
}
`

export type GetAuthTokensGqlData = {
  login: Pick<GqlDataProps, "authToken" | "refreshToken"> & {
    user: Pick<GqlDataProps, "databaseId" | "name" | "email">
  }
}

export type GetAuthTokensGqlInput = Pick<GqlInputProps, "identity">

export const UpdateUserMetaGql = `
mutation UpdateUserMetaGql($id: ID, $metaData: [MetaDataInput]) {
  updateCustomer(input: {id: $id, metaData: $metaData}) {
    clientMutationId
  }
}
`
export type UpdateUserMetaGqlInput = Pick<GqlInputProps, "id" | "metaData">

export const GetPincodeGql = `
query GetPincodeGql {
  customer {
    shipping {
      postcode
    }
  }
}
`

export type GetPincodeGqlResponse = {
  customer: {
    shipping: {
      postcode: string
    }
  }
}

export const GetUserMetaDataGql = `
query GetUserMetaDataGql($customerId: Int = 0, $keysIn: [String] = []) {
  customer(customerId: $customerId) {
    metaData(keysIn: $keysIn, multiple: true) {
      key
      value
    }
  }
}
`

export type GetUserMetaDataGqlResponse = {
  customer: {
    metaData: Pick<GqlDataProps, "metaData">["metaData"] | null
  }
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

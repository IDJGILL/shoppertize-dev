import type { PickDataFields, PickInputFields } from "~/vertex/global/global-types"

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

export type UserByIdGqlOutput = {
  user: PickDataFields<"databaseId" | "firstName" | "lastName" | "email" | "userMetaData">
}

export type UserByIdGqlInput = PickInputFields<"id" | "idType">

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
    authTokenExpiration
    refreshTokenExpiration
  }
}
`

export type PasswordLoginGqlOutput = {
  login: PickDataFields<"authToken" | "refreshToken"> & {
    user: PickDataFields<"databaseId" | "name" | "email">
  } & PickDataFields<"authTokenExpiration" | "refreshTokenExpiration">
}

export type PasswordLoginGqlInput = {
  credentials: PickInputFields<"username" | "password">
}

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
    authTokenExpiration
    refreshTokenExpiration
  }
}
`

export type GetAuthTokensGqlOutput = {
  login: PickDataFields<"authToken" | "refreshToken"> & {
    user: PickDataFields<"databaseId" | "name" | "email">
  } & PickDataFields<"authTokenExpiration" | "refreshTokenExpiration">
}

export type GetAuthTokensGqlInput = PickInputFields<"identity">

export const RefreshAccessTokenGql = `
mutation RefreshAccessTokenGql($refreshToken: String = "") {
  refreshToken(input: {refreshToken: $refreshToken}) {
    authToken
    authTokenExpiration
  }
}
`

export type RefreshAccessTokenGqlOutput = {
  refreshToken: PickDataFields<"authToken" | "authTokenExpiration">
}

export type RefreshAccessTokenGqlInput = PickDataFields<"refreshToken">

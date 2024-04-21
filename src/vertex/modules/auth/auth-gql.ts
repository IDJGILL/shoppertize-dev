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
  user: Pick<
    GqlDataProps,
    "databaseId" | "firstName" | "lastName" | "email" | "userMetaData"
  >
}

export type UserByIdGqlInput = Pick<GqlInputProps, "id" | "idType">

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
  login: Pick<GqlDataProps, "authToken" | "refreshToken"> & {
    user: Pick<GqlDataProps, "databaseId" | "name" | "email">
  } & Pick<GqlDataProps, "authTokenExpiration" | "refreshTokenExpiration">
}

export type PasswordLoginGqlInput = {
  credentials: Pick<GqlInputProps, "username" | "password">
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
  login: Pick<GqlDataProps, "authToken" | "refreshToken"> & {
    user: Pick<GqlDataProps, "databaseId" | "name" | "email">
  } & Pick<GqlDataProps, "authTokenExpiration" | "refreshTokenExpiration">
}

export type GetAuthTokensGqlInput = Pick<GqlInputProps, "identity">

export const RefreshAccessTokenGql = `
mutation RefreshAccessTokenGql($refreshToken: String = "") {
  refreshToken(input: {refreshToken: $refreshToken}) {
    authToken
    authTokenExpiration
  }
}
`

export type RefreshAccessTokenGqlOutput = {
  refreshToken: Pick<GqlDataProps, "authToken" | "authTokenExpiration">
}

export type RefreshAccessTokenGqlInput = Pick<GqlInputProps, "refreshToken">

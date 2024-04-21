import type { DefaultSession } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"
import { type WrapTRPCSuccess } from "~/lib/trpc/trpc-instance"

export type LoginCredentialsQueryData = {
  login: {
    authToken: string
    refreshToken: string
    user: {
      databaseId: number
      name: string
      email: string
    }
  }
}

export type AuthOutput = {
  id: string | null
  action: AuthAction | "none"
  verification: Authorize["verification"] | null
}

export type AuthAction = "otp" | "link" | "login" | "signup" | "reset"

export type Authorize = {
  id: string
  ip: string
  expiry: number
  createdAt: number
  isVerified: boolean
  username: string
  verification: "otp" | "link"
  action: "login" | "signup" | "reset"
  resendCount: number
  secret: string
  countryCode: string
}

export type AuthorizeMethodAction = PickFromUnion<
  AuthAction,
  "login" | "signup" | "reset" | "session_exp" | "partial_exp"
>

// export type AuthorizeMethods = {
//   secret: (props: Pick<Authorize, "verification">) => string

//   create: (
//     props: Pick<Authorize, "ip" | "action" | "username" | "countryCode"> & {
//       onSuccess: (props: Authorize) => void | Promise<void>
//     },
//   ) => Promise<WrapTRPCSuccess<Authorize, Pick<Authorize, "action">["action"]>>

//   get: (
//     props: Pick<Authorize, "id" | "ip">,
//   ) => Promise<WrapTRPCSuccess<Authorize, AuthorizeMethodAction>>

//   verify: (
//     props: Pick<Authorize, "id" | "ip" | "secret">,
//   ) => Promise<WrapTRPCSuccess<Authorize, AuthorizeMethodAction>>

//   checkVerified: (
//     props: Pick<Authorize, "id" | "ip">,
//   ) => Promise<WrapTRPCSuccess<Authorize | null, AuthorizeMethodAction>>

//   checkExpire: (props: Authorize) => boolean

//   checkRetry: (props: Authorize) => boolean

//   checkExist: (props: Authorize) => Promise<boolean>

//   checkResend: (props: Authorize) => boolean

//   recreate: (
//     props: Pick<Authorize, "id" | "ip"> & {
//       onSuccess: (props: Authorize) => void | Promise<void>
//     },
//   ) => Promise<WrapTRPCSuccess<Authorize, AuthorizeMethodAction>>

//   delete: (id: string) => Promise<void>

//   tokens: (username: string) => Promise<
//     Pick<GqlDataProps, "authToken" | "refreshToken"> & {
//       user: Pick<GqlDataProps, "databaseId" | "email" | "name">
//     }
//   >
// }

export type PickFromUnion<T, K> = T extends K ? T : never

import { type DefaultSession } from "next-auth"
import { type DefaultJWT } from "next-auth/jwt"
import type { Authentication } from "~/vertex/global/types"
import type { RedisExtend } from "~/vertex/lib/redis/redis-types"

export type ExtendUser = DefaultSession["user"] & {
  id: string
  name: string
  email: string
}

declare module "next-auth" {
  interface Session {
    user: ExtendUser
    authToken: string
    error?: "RefreshAccessTokenError"
  }
  interface User {
    tokens?: {
      authToken: string
      refreshToken: string
    }
  }
}

type ExtendJWT = DefaultJWT & {
  id: string
  authToken: string
  refreshToken: string
  expiresAt: number
}

declare module "next-auth/jwt" {
  interface JWT extends ExtendJWT {}
}

export type AuthenticationAction = "otp" | "status-polling" | "login" | "signup" | "reset" | "verify" | "none"

export type CreateUserProps = {
  email: string
  password?: string | null
  name?: string | null
}

export type IdentifyUserOutput = Pick<RedisExtend<Authentication>, "id" | "action" | "verification">

export type VerifyUserOutput = Pick<RedisExtend<Authentication>, "id" | "action" | "verification"> & {
  sameDevice: boolean
  message: string
}

export type ResendVerifyOutput = Pick<RedisExtend<Authentication>, "id" | "action" | "verification">

export type ForgetPasswordOutput = Pick<RedisExtend<Authentication>, "id" | "action" | "verification">

export type CheckVerificationOutput = Pick<RedisExtend<Authentication>, "id" | "action" | "verification" | "isVerified">

export type NextAuthSignInOutput = {
  id: string
  email: string | null
  name: string
  tokens: {
    authToken: string
    refreshToken: string
  }
}

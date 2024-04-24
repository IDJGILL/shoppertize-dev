import "server-only"

import {
  createAuthSession,
  createAuthenticationSession,
  createEmailId,
  createUser,
  getAuthenticationSession,
  getUserBy,
  hasActionPermission,
  isExistingUser,
  isVerified,
  recreateAuthenticationSecret,
  setClientIdInCookies,
  verifyAuthenticationSecret,
} from "./auth-server-utils"
import type {
  CheckVerificationOutput,
  ForgetPasswordOutput,
  IdentifyUserOutput,
  NextAuthSignInOutput,
  ResendVerifyOutput,
  VerifyUserOutput,
} from "./auth-types"
import { nanoid } from "nanoid"
import { AuthError } from "next-auth"
import { cookies } from "next/headers"
import { type JWT } from "next-auth/jwt"
import { getAuthTokens } from "./auth-queries"
import { login, signup } from "../../lib/action/actions"
import { signIn } from "~/vertex/lib/auth/config"
import { emailClient } from "~/lib/smtp/smtp-client"
import { identifyUsernameType } from "./auth-client-utils"
import { type Authentication } from "~/vertex/global/types"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { wooClient } from "~/vertex/lib/wordpress/woocommerce-client"
import { magicLinkEmailTemplate } from "~/lib/modules/auth/auth-emails"
import type { Verify, Identify, AuthSessionId, Login, Signup, ForgetPassword, UpdatePassword } from "./auth-models"
import { redisDelete, redisUpdate } from "~/vertex/lib/redis/utils"
import { type RedisExtend } from "~/vertex/lib/redis/types"

export const identifyUser = async (input: Identify): Promise<IdentifyUserOutput> => {
  const email = createEmailId(input.username, input.countryCode)

  const usernameType = identifyUsernameType(input.username)

  if (await isExistingUser(email)) {
    const isPhoneVerification = usernameType === "phone"

    if (isPhoneVerification) {
      const session = await createAuthenticationSession({
        ip: "none", // Todo
        action: "login",
        username: input.username,
        countryCode: input.countryCode,
      })

      setClientIdInCookies(session.clientId)

      notification(session)

      return {
        id: session.id,
        action: "login",
        verification: "otp",
      }
    }

    return {
      id: "none",
      action: "login",
      verification: "link",
    }
  }

  const session = await createAuthenticationSession({
    ip: "none", // Todo
    action: "signup",
    username: input.username,
    countryCode: input.countryCode,
  })

  setClientIdInCookies(session.clientId)

  notification(session)

  return {
    id: session.id,
    action: "signup",
    verification: session.verification,
  }
}

export const verifyUser = async (input: Verify): Promise<VerifyUserOutput> => {
  const clientId = cookies().get("clientId")?.value

  const session = await verifyAuthenticationSecret({
    id: input.id,
    secret: input.value,
  })

  const isSameDevice = session.clientId === (clientId ?? "")

  const message = isSameDevice ? "Thanks for verifying, You can close this window now." : "Thanks for verifying."

  if (session.action === "login") {
    if (session)
      await login({
        id: session.id,
        username: session.username,
        password: session.secret,
      })

    return {
      id: session.id,
      action: session.action,
      verification: session.verification,
      sameDevice: isSameDevice,
      message,
    }
  }

  if (session.verification === "otp") {
    if (session.action === "signup") {
      await signup({ id: session.id, name: "New User", password: nanoid(32) })

      return {
        id: session.id,
        action: session.action,
        verification: session.verification,
        sameDevice: isSameDevice,
        message,
      }
    }

    await login({
      id: session.id,
      username: session.username,
      password: session.secret,
    })

    return {
      id: session.id,
      action: session.action,
      verification: session.verification,
      sameDevice: isSameDevice,
      message,
    }
  }

  return {
    id: session.id,
    action: session.action,
    verification: session.verification,
    sameDevice: isSameDevice,
    message,
  }
}

export const resendVerify = async (input: AuthSessionId): Promise<ResendVerifyOutput> => {
  const session = await recreateAuthenticationSecret(input.id)

  notification(session)

  return {
    id: session.id,
    action: session.action,
    verification: session.verification,
  }
}

export const loginUser = async (input: Login): Promise<void> => {
  try {
    await signIn("credentials", { ...input })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          throw new ExtendedError({
            code: "BAD_REQUEST",
            message: "Incorrect password entered, Please try again.",
          })
        }

        default: {
          throw new ExtendedError({
            code: "INTERNAL_SERVER_ERROR",
          })
        }
      }
    }
  }
}

export const signUpUser = async (input: Signup): Promise<void> => {
  const session = await getAuthenticationSession(input.id)

  if (!isVerified(session) || !hasActionPermission("signup", session)) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "Please verify your email to signup",
    })
  }

  await createUser({
    name: input.name,
    email: session.username,
    password: input.password,
  })

  await redisDelete({ id: session.id, idPrefix: "@session/authentication" })

  await login({
    username: session.username,
    password: input.password,
  })
}

export const forgetPassword = async (input: ForgetPassword): Promise<ForgetPasswordOutput> => {
  if (!(await isExistingUser(input.email))) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Account does not exist with this email",
    })
  }

  const session = await createAuthenticationSession({
    ip: "none", // Todo
    action: "reset",
    countryCode: "91",
    username: input.email,
  })

  setClientIdInCookies(session.clientId)

  notification(session)

  return {
    id: session.id,
    action: session.action,
    verification: session.verification,
  }
}

export const updatePassword = async (input: UpdatePassword): Promise<void> => {
  const session = await getAuthenticationSession(input.id)

  if (!isVerified(session) || !hasActionPermission("reset", session)) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "Please verify your email to update your password",
    })
  }

  const user = await getUserBy({ id: session.username, idType: "EMAIL" })

  if (!user) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Account does not exist with this email",
    })
  }

  await wooClient({
    method: "PUT",
    path: "customers",
    id: user.databaseId.toString(),
    data: {
      password: input.password,
    },
    cacheConfig: "no-cache",
  })

  await redisUpdate<Authentication>({ id: input.id, idPrefix: "@session/authentication", payload: { action: "login" } })

  await login({
    id: session.id,
    username: session.username,
    password: input.password,
  })
}

export const checkVerification = async (input: AuthSessionId): Promise<CheckVerificationOutput> => {
  const session = await getAuthenticationSession(input.id)

  if (session.action === "login") {
    await login({
      id: session.id,
      username: session.username,
      password: "none",
    })

    return {
      id: session.id,
      action: session.action,
      verification: session.verification,
      isVerified: session.isVerified,
    }
  }

  return {
    id: session.id,
    action: session.action,
    verification: session.verification,
    isVerified: session.isVerified,
  }
}

export const nextAuthSignIn = async (input: Login): Promise<NextAuthSignInOutput> => {
  /**
   * This means that user requesting signin either email or otp
   */

  if (!!input.id) {
    const session = await getAuthenticationSession(input.id)

    if (!isVerified(session) || !hasActionPermission("login", session)) {
      throw new ExtendedError({ code: "BAD_REQUEST" })
    }

    const data = await getAuthTokens({ username: session.username })

    console.log({ data })

    await redisDelete({ id: input.id, idPrefix: "@session/authentication" })

    await createAuthSession(data)

    const { authToken, refreshToken, user } = data

    return {
      id: user.databaseId.toString(),
      email: user.email,
      name: user.name,
      tokens: { authToken, refreshToken },
    }
  }

  const data = await getAuthTokens({
    username: input.username,
    password: input.password,
  })

  await createAuthSession(data)

  const { authToken, refreshToken, user } = data

  return {
    id: user.databaseId.toString(),
    email: user.email,
    name: user.name,
    tokens: { authToken, refreshToken },
  }
}

export const nextAuthGoogleSignIn = async (token: JWT): Promise<JWT | null> => {
  if (!token.email) throw new Error("Email not found")

  const userNotFound = !(await isExistingUser(token.email))

  if (userNotFound) {
    await createUser({ email: token.email, name: token.name })

    const data = await getAuthTokens({ username: token.email })

    await createAuthSession(data)

    const { user, authToken, refreshToken, authTokenExpiration } = data

    return {
      ...token,
      id: user.databaseId.toString(),
      authToken: authToken,
      refreshToken: refreshToken,
      expiresAt: +authTokenExpiration,
    }
  }

  const data = await getAuthTokens({ username: token.email })

  await createAuthSession(data)

  const {
    authToken,
    refreshToken,
    user: { databaseId, name, email },
    authTokenExpiration,
  } = data

  return {
    ...token,
    id: databaseId.toString(),
    name,
    email,
    authToken,
    refreshToken,
    expiresAt: +authTokenExpiration,
  }
}

export const notification = (session: RedisExtend<Authentication>) => {
  switch (session.verification) {
    case "link": {
      void emailClient({
        to: session.username,
        html: magicLinkEmailTemplate(session),
        subject: "Confirm your email address",
      }) // Todo Change its location from serverless function to hono framework

      break
    }

    case "otp": {
      // Todo - Send SMS

      break
    }
  }
}

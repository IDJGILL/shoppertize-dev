import appConfig from "app.config"
import { customAlphabet, nanoid } from "nanoid"
import { type Authorize } from "./auth-types"
import { TRPCError } from "@trpc/server"
import { redisClient } from "~/lib/redis/redis-client"
import {
  UserByIdGql,
  UserMetaGql,
  PasswordLoginGql,
  GetAuthTokensGql,
  UpdateUserMetaGql,
  RefreshAccessTokenGql,
  type UserByIdGqlData,
  type UserByIdGqlInput,
  type GetAuthTokensGqlData,
  type GetAuthTokensGqlInput,
  type UserMetaGqlData,
  type UserMetaGqlInput,
  type UpdateUserMetaGqlInput,
  type RefreshAccessTokenGqlData,
  type RefreshAccessTokenGqlInput,
  type PasswordLoginGqlData,
  type PasswordLoginGqlInput,
} from "./auth-gql"
import { client } from "~/lib/graphql/client"
import { woocommerce } from "~/lib/server/access/woocommerce"
import { env } from "~/env.mjs"
import { type Session } from "next-auth"
import { meta } from "~/lib/utils/functions/meta"
import { type Login, type Profile } from "./auth-schema"
import { emailClient } from "~/lib/smtp/smtp-client"
import { magicLinkEmailTemplate } from "./auth-emails"
import { identifyUsernameType } from "./auth-client-utils"

/**
 * Handles direct and email-password logins
 */
export const authLoginHandler = async (props: Login) => {
  if (props.id) {
    const session = await getAuthenticationSession(props.id).catch(() => null)

    if (!session?.isVerified) return null

    const data = await getAuthTokens({ username: session.username })

    if (!data) return null

    await redisClient.json.del(props.id)

    const { authToken, refreshToken, user } = data

    return {
      id: user.databaseId.toString(),
      email: user.email,
      name: user.name,
      tokens: { authToken, refreshToken },
    }
  }

  const data = await getAuthTokens({
    username: props.username,
    password: props.password,
  })

  if (!data) return null

  const { authToken, refreshToken, user } = data

  return {
    id: user.databaseId.toString(),
    email: user.email,
    name: user.name,
    tokens: { authToken, refreshToken },
  }
}

/**
 * Gets auth tokens by either from username and password or just username
 */
export async function getAuthTokens(props: {
  username: string
  password?: string
}) {
  try {
    if (props.password) {
      const data = await client<PasswordLoginGqlData, PasswordLoginGqlInput>({
        access: "public",
        query: PasswordLoginGql,
        cacheTags: [],
        noCache: true,
        method: "POST",
        inputs: {
          credentials: {
            username: props.username,
            password: props.password,
          },
        },
      })

      return data.login
    }

    const data = await client<GetAuthTokensGqlData, GetAuthTokensGqlInput>({
      access: "public",
      query: GetAuthTokensGql,
      cacheTags: [],
      method: "POST",
      headers: {
        "X-AUTH-SECRET": env.AUTH_SECRET,
      },
      inputs: {
        identity: props.username,
      },
      noCache: true,
    })

    return data.login
  } catch {
    return null
  }
}

/**
 * Gets the current authentication session
 * @throws `UNAUTHORIZED` You are away for too long, Please try again.
 */
export async function getAuthenticationSession(id: string) {
  const session = (await redisClient.json.get(id)) as Authorize | null

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are away for too long, Please try again.",
    })
  }

  return session
}

/**
 * Crates secret for both login and verification
 */
export function createVerificationSecret(
  props: Pick<Authorize, "verification">,
) {
  const { otpLength } = appConfig.authentication

  const random = customAlphabet("123456789", otpLength)

  const otp = random()

  const secret = nanoid(8)

  switch (props.verification) {
    case "link": {
      return secret
    }

    case "otp": {
      return otp
    }
  }
}

/**
 * Creates session for authentication
 */
export async function createAuthenticationSession(
  props: Pick<Authorize, "ip" | "action" | "username" | "countryCode">,
) {
  const id = nanoid()

  const createdAt = new Date().getTime()

  const { secretExpiryInSec, ttl } = appConfig.authentication

  const usernameType = identifyUsernameType(props.username)

  if (usernameType === "unknown") {
    throw new TRPCError({ code: "BAD_REQUEST" })
  }

  const secret = createVerificationSecret({
    verification: usernameType === "email" ? "link" : "otp",
  })

  const username = createEmailId(props.username, props.countryCode)

  await redisClient.json.set(id, "$", {
    ...props,
    id,
    secret,
    username,
    createdAt,
    resendCount: 0,
    isVerified: false,
    expiry: secretExpiryInSec,
    verification: usernameType === "email" ? "link" : "otp",
  } satisfies Authorize)

  await redisClient.expire(id, ttl)

  const session = await getAuthenticationSession(id)

  return session
}

/**
 * Creates email id from either phone number or email itself.
 */
export function createEmailId(username: string, countryCode: string) {
  const usernameType = identifyUsernameType(username)

  const phoneUsername = countryCode + username + "@email.com"

  return usernameType === "email" ? username : phoneUsername
}

/**
 * Verifies the authentication secret and also checks if it expired or not.
 */
export async function verifyAuthenticationSecret(props: {
  id: string
  secret: string
}) {
  const session = await getAuthenticationSession(props.id)

  if (isAuthenticationSecretExpired(session)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        session.verification === "link"
          ? "The link is expired already."
          : "Your otp is expired already.",
    })
  }

  if (session.secret !== props.secret) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        session.verification === "link"
          ? "The link is invalid."
          : "Your otp is incorrect.",
    })
  }

  const isUpdated = await redisClient.json.set(props.id, "$.isVerified", true)

  if (isUpdated !== "OK") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

  const updatedSession = await getAuthenticationSession(props.id)

  return updatedSession
}

/**
 * Checks if authentication secret is expired or not.
 */
export function isAuthenticationSecretExpired(props: Authorize) {
  const elapsedTime = (new Date().getTime() - props.createdAt) / 1000

  return elapsedTime >= props.expiry
}

/**
 * Recreates authentication secret and updates session with new secret, ttl and expiry.
 */
export async function recreateAuthenticationSecret(id: string) {
  const session = await getAuthenticationSession(id)

  const { ttl } = appConfig.authentication

  const secret = createVerificationSecret(session)

  if (canRetryVerification(session)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Please wait for the timer before you try again.`,
    })
  }

  if (session.action === "signup" && (await isExistingUser(session.username))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "An account with this email already created.",
    })
  }

  if (!canResendVerification(session)) {
    await redisClient.json.del(session.id)

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "You've reached the maximum retries, please try again.",
    })
  }

  await Promise.all([
    redisClient.json.set(id, "$.createdAt", new Date().getTime()),
    redisClient.json.numincrby(id, "$.resendCount", 1),
    redisClient.json.set(id, "$.secret", `"${secret}"`),
  ])

  await redisClient.expire(id, ttl)

  const updatedSession = await getAuthenticationSession(id)

  return updatedSession
}

/**
 * Checks if user can try again after 60 sec timer
 */
export function canRetryVerification(props: Authorize) {
  const elapsedTime = (new Date().getTime() - props.createdAt) / 1000

  const { retryInSec } = appConfig.authentication

  return elapsedTime <= retryInSec
}

/**
 * Checks if user can request another otp or link
 */
export function canResendVerification(props: Authorize) {
  const { maxResend } = appConfig.authentication

  return props.resendCount !== maxResend
}

/**
 * Checks if user already exists in our database
 */
export async function isExistingUser(email: string) {
  const user = await getUserBy({ id: email, idType: "EMAIL" })

  return !!user
}

/**
 * Gets the user details by UserNodeIdTypeEnum
 */
export async function getUserBy(inputs: UserByIdGqlInput) {
  const response = await client<UserByIdGqlData, UserByIdGqlInput>({
    access: "admin",
    query: UserByIdGql,
    inputs,
  })

  return response.user
}

/**
 * Creates user in wordpress using woocommerce api.
 */
export async function createUser(props: {
  email: string
  password: string
  name: string
}) {
  try {
    await woocommerce(
      "POST",
      "customers",
      {
        email: props.email,
        username: props.email,
        password: props.password,
        first_name: props.name.split(" ")[0] ?? "",
        last_name: props.name.split(" ")[1] ?? "",
      },
      "no-cache",
    )
  } catch {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    })
  }
}

/**
 * Gets user profile data
 */
export async function getUserProfile(authToken: string) {
  const data = await client<UserMetaGqlData, UserMetaGqlInput>({
    access: "user",
    authToken,
    query: UserMetaGql,
    inputs: {
      key: "profile",
    },
  })

  const { metaData } = data.customer

  const profile = meta.profile.safeParse(metaData)

  return profile
}

/**
 * Updates user profile data
 */
export async function updateUserProfile(props: {
  session: Session
  input: Profile
}) {
  await client<boolean, UpdateUserMetaGqlInput>({
    access: "user",
    query: UpdateUserMetaGql,
    authToken: props.session.authToken,
    inputs: {
      id: props.session.user.id,
      metaData: [meta.profile.add(props.input)],
    },
  })
}

/**
 * Refreshes auth tokens using issued refresh Token
 */
export async function refreshAuthToken(refreshToken: string) {
  try {
    const data = await client<
      RefreshAccessTokenGqlData,
      RefreshAccessTokenGqlInput
    >({
      access: "public",
      query: RefreshAccessTokenGql,
      inputs: {
        refreshToken,
      },
      cacheTags: [],
      noCache: true,
      method: "POST",
    })

    return data.refreshToken
  } catch {
    return null
  }
}

export function handleNotification(session: Authorize) {
  switch (session.verification) {
    case "link": {
      void emailClient({
        to: session.username,
        html: magicLinkEmailTemplate(session),
        subject: "Confirm your email address",
      })

      break
    }

    case "otp": {
      // Todo - Send SMS

      break
    }
  }
}

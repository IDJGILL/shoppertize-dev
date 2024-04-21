import "server-only"
import {
  UserByIdGql,
  RefreshAccessTokenGql,
  type GetAuthTokensGqlOutput,
  type RefreshAccessTokenGqlInput,
  type RefreshAccessTokenGqlOutput,
  type UserByIdGqlInput,
  type UserByIdGqlOutput,
} from "./auth-gql"
import { cookies } from "next/headers"
import { customAlphabet, nanoid } from "nanoid"
import { config } from "~/vertex/global/config"
import { type CreateUserProps } from "./auth-types"
import { redisClient } from "~/vertex/lib/redis/client"
import { identifyUsernameType } from "./auth-client-utils"
import { wpClient } from "~/vertex/lib/wordpress/wp-client"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { getCurrentAddress } from "../address/address-queries"
import { wooClient } from "~/vertex/lib/wordpress/woocommerce-client"
import type { AuthSession, Authentication } from "~/vertex/global/types"

export async function createAuthSession(props: GetAuthTokensGqlOutput["login"]) {
  const uid = props.user.databaseId

  const recordId = `@session/auth/${uid}`

  const address = await getCurrentAddress(uid)

  const result = await redisClient.json.set(recordId, "$", {
    uid,
    username: props.user.email ?? "",
    name: props.user.name,
    loggedInAt: Date.now().toString(),
    expireAt: props.refreshTokenExpiration,
    currentAddress: address,
  } satisfies AuthSession)

  if (result !== "OK") throw new Error("Internal server error")
}

export function createEmailId(username: string, countryCode: string) {
  const usernameType = identifyUsernameType(username)

  const phoneUsername = countryCode + username + "@email.com"

  return usernameType === "email" ? username : phoneUsername
}

export async function isExistingUser(email: string) {
  const user = await getUserBy({ id: email, idType: "EMAIL" })

  return !!user
}

export async function getUserBy(inputs: UserByIdGqlInput) {
  const response = await wpClient<UserByIdGqlOutput, UserByIdGqlInput>({
    access: "admin",
    query: UserByIdGql,
    inputs,
  })

  return response.user
}

export async function createAuthenticationSession(
  props: Pick<Authentication, "ip" | "action" | "username" | "countryCode">,
) {
  const randomId = nanoid()

  const recordId = `@session/authentication/${randomId}`

  const createdAt = new Date().getTime()

  const { secretExpiryInSec, ttl } = config.authentication

  const usernameType = identifyUsernameType(props.username)

  if (usernameType === "unknown") {
    throw new ExtendedError({ code: "BAD_REQUEST" })
  }

  const secret = createVerificationSecret({
    verification: usernameType === "email" ? "link" : "otp",
  })

  const username = createEmailId(props.username, props.countryCode)

  await redisClient.json.set(recordId, "$", {
    ...props,
    id: randomId,
    secret,
    username,
    createdAt,
    resendCount: 0,
    isVerified: false,
    expiry: secretExpiryInSec,
    verification: usernameType === "email" ? "link" : "otp",
    clientId: nanoid(),
  } satisfies Authentication)

  await redisClient.expire(recordId, ttl)

  const session = await getAuthenticationSession(randomId)

  return session
}

export function createVerificationSecret(props: Pick<Authentication, "verification">) {
  const { otpLength } = config.authentication

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

export async function getAuthenticationSession(id: string) {
  const session = (await redisClient.json.get(`@session/authentication/${id}`)) as Authentication | null

  if (!session) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "You are away for too long, Please try again.",
    })
  }

  return session
}

export async function verifyAuthenticationSecret(props: { id: string; secret: string }) {
  const recordId = `@session/authentication/${props.id}`

  const session = await getAuthenticationSession(props.id)

  if (session.isVerified && session.verification === "link") {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "The link is already verified",
    })
  }

  if (isAuthenticationSecretExpired(session)) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: session.verification === "link" ? "The link is expired already." : "Your otp is expired already.",
    })
  }

  if (session.secret !== props.secret) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: session.verification === "link" ? "The link is invalid." : "Your otp is incorrect.",
    })
  }

  const isUpdated = await redisClient.json.set(recordId, "$.isVerified", true)

  if (isUpdated !== "OK") throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })

  const updatedSession = await getAuthenticationSession(props.id)

  return updatedSession
}

export function isAuthenticationSecretExpired(props: Authentication) {
  const elapsedTime = (new Date().getTime() - props.createdAt) / 1000

  return elapsedTime >= props.expiry
}

export async function createUser(props: CreateUserProps) {
  const name = props.name ?? "There"

  const password = props.password ?? nanoid(32)

  await wooClient({
    method: "POST",
    path: "customers",
    data: {
      email: props.email,
      username: props.email,
      password: password,
      first_name: name.split(" ")[0] ?? "",
      last_name: name.split(" ")[1] ?? "",
    },
    cacheConfig: "no-cache",
  })
}

export async function recreateAuthenticationSecret(id: string) {
  const session = await getAuthenticationSession(id)

  const recordId = `@session/authentication/${id}`

  const { ttl } = config.authentication

  const secret = createVerificationSecret(session)

  if (canRetryVerification(session)) {
    throw new ExtendedError({
      code: "CONFLICT",
      message: `Please wait for the timer before you try again.`,
    })
  }

  if (session.action === "signup" && (await isExistingUser(session.username))) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "An account with this email already created.",
    })
  }

  if (!canResendVerification(session)) {
    await redisClient.json.del(session.id)

    throw new ExtendedError({
      code: "TOO_MANY_REQUESTS",
      message: "You've reached the maximum retries, please try again.",
    })
  }

  await Promise.all([
    redisClient.json.set(recordId, "$.createdAt", new Date().getTime()),
    redisClient.json.numincrby(recordId, "$.resendCount", 1),
    redisClient.json.set(recordId, "$.secret", `"${secret}"`),
  ])

  await redisClient.expire(recordId, ttl)

  const updatedSession = await getAuthenticationSession(id)

  return updatedSession
}

export function canRetryVerification(props: Authentication) {
  const elapsedTime = (new Date().getTime() - props.createdAt) / 1000

  const { retryInSec } = config.authentication

  return elapsedTime <= retryInSec
}

export function canResendVerification(props: Authentication) {
  const { maxResend } = config.authentication

  return props.resendCount !== maxResend
}

export async function refreshAuthToken(refreshToken: string) {
  const data = await wpClient<RefreshAccessTokenGqlOutput, RefreshAccessTokenGqlInput>({
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
}

export function isVerified(props: Authentication) {
  const clientId = cookies().get("clientId")?.value

  return props.isVerified && props.clientId === clientId
}

export function setClientIdInCookies(clientId: string) {
  cookies().set("clientId", clientId, {
    secure: true,
    httpOnly: true,
    sameSite: true,
  })
}

/**
 * Checks if the provided authentication action matches the action in the provided authentication object.
 * @param {Authentication["action"]} to - The authentication action to check against.
 * @param {Authentication} s - The authentication object containing the action to compare.
 * @returns {boolean} True if the authentication action matches, otherwise false.
 *
 * @example
 * Example of using hasActionPermission function
 * const authentication = { action: "login" };
 * const actionToCheck = "login";
 * const hasActionPermissionResult = hasActionPermission(actionToCheck, authentication);
 * console.log(hasActionPermissionResult); // Output: true
 */
export function hasActionPermission(to: Authentication["action"], s: Authentication): boolean {
  return s.action === to
}

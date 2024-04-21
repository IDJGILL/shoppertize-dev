import type { AuthOutput } from "./auth-types"
import { env } from "~/env.mjs"
import {
  type Identify,
  type UpdatePassword,
  type Verify,
  type Signup,
  type ForgetPassword,
  type AuthSessionId,
} from "./auth-schema"
import { woocommerce } from "~/lib/server/access/woocommerce"
import { trpcPublic } from "~/lib/trpc/trpc-context"
import {
  createAuthenticationSession,
  createEmailId,
  createUser,
  getAuthenticationSession,
  getUserBy,
  handleNotification,
  isExistingUser,
  recreateAuthenticationSecret,
  verifyAuthenticationSecret,
} from "./auth-server-utils"
import { redisClient } from "~/lib/redis/redis-client"
import { identifyUsernameType } from "./auth-client-utils"
import { auth } from "./auth-config"
import { type Session } from "next-auth"

export const identify = trpcPublic<Identify, AuthOutput>(async (props) => {
  const email = createEmailId(props.input.username, props.input.countryCode)

  const usernameType = identifyUsernameType(props.input.username)

  if (await isExistingUser(email)) {
    const isPhoneNumberType = usernameType === "phone"

    if (isPhoneNumberType) {
      const session = await createAuthenticationSession({
        ip: props.ip,
        action: "login",
        username: props.input.username,
        countryCode: props.input.countryCode,
      })

      handleNotification(session)

      return props.response.success({
        data: {
          id: session.id,
          action: "otp",
          verification: session.verification,
        },
      })
    }

    return props.response.success({
      data: {
        id: null,
        action: "login",
        verification: null,
      },
    })
  }

  const session = await createAuthenticationSession({
    ip: props.ip,
    action: "signup",
    username: props.input.username,
    countryCode: props.input.countryCode,
  })

  handleNotification(session)

  return props.response.success({
    data: {
      id: session.id,
      action: session.verification,
      verification: session.verification,
    },
  })
})

export const verify = trpcPublic<Verify, AuthOutput>(async (props) => {
  const session = await verifyAuthenticationSecret({
    id: props.input.id,
    secret: props.input.value,
  })

  if (session.action === "signup" && session.verification === "otp") {
    await createUser({
      name: "New User",
      email: session.username,
      password: session.id + env.AUTH_SECRET,
    })

    return props.response.success({
      data: {
        action: "login",
        id: session.id,
        verification: "otp",
      },
    })
  }

  return props.response.success({
    data: {
      id: session.id,
      action: session.verification === "otp" ? "login" : session.action,
      verification: session.verification,
    },
  })
})

export const resend = trpcPublic<AuthSessionId, AuthOutput>(async (props) => {
  const session = await recreateAuthenticationSecret(props.input.id)

  handleNotification(session)

  return props.response.success({
    data: {
      action: session.verification,
      id: session.id,
      verification: session.verification,
    },
  })
})

export const signup = trpcPublic<Signup, AuthOutput>(async (props) => {
  const session = await getAuthenticationSession(props.input.id)

  if (!session.isVerified) {
    return props.response.error({
      code: "UNAUTHORIZED",
      message: "Please verify your email to signup",
    })
  }

  await createUser({
    name: props.input.name,
    email: session.username,
    password: props.input.password,
  })

  await redisClient.json.del(session.id)

  return props.response.success({
    data: {
      id: null,
      action: "login",
      verification: null,
    },
  })
})

export const forget = trpcPublic<ForgetPassword, AuthOutput>(async (props) => {
  if (!(await isExistingUser(props.input.email))) {
    return props.response.error({
      code: "NOT_FOUND",
      message: "Account does not exist with this email",
    })
  }

  const session = await createAuthenticationSession({
    ip: props.ip,
    action: "reset",
    countryCode: "91",
    username: props.input.email,
  })

  handleNotification(session)

  return props.response.success({
    data: {
      id: session.id,
      action: "link",
      verification: session.verification,
    },
  })
})

export const update = trpcPublic<UpdatePassword, AuthOutput>(async (props) => {
  const session = await getAuthenticationSession(props.input.id)

  if (!session.isVerified) {
    return props.response.error({
      code: "UNAUTHORIZED",
      message: "Please verify your email to update your password",
    })
  }

  const user = await getUserBy({ id: session.username, idType: "EMAIL" })

  if (!user) {
    return props.response.error({
      code: "NOT_FOUND",
      message: "Account does not exist with this email",
    })
  }

  await woocommerce(
    "PUT",
    `customers/${user.databaseId}`,
    {
      password: props.input.password,
    },
    "no-cache",
  )

  await redisClient.json.del(session.id)

  return props.response.success({
    data: {
      id: session.id,
      action: "none",
      verification: session.verification,
    },
  })
})

export const session = trpcPublic<unknown, Session["user"] | null>(
  async (props) => {
    const session = await auth()

    if (!session) {
      return props.response.success({
        data: null,
      })
    }

    return props.response.success({
      data: {
        ...session.user,
      },
    })
  },
)

export const status = trpcPublic<AuthSessionId, AuthOutput>(async (props) => {
  const session = await getAuthenticationSession(props.input.id)

  return props.response.success({
    data: {
      id: session.id,
      action: session.action,
      verification: !session.isVerified ? null : session.verification,
    },
  })
})

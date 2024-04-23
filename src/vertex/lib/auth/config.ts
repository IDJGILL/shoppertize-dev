import "server-only"

import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"
import { env } from "~/env.mjs"
import { $Login } from "~/vertex/modules/auth/auth-models"
import { refreshAuthToken } from "~/vertex/modules/auth/auth-server-utils"
import { createTokenExpiry, isTokenExpired } from "~/vertex/modules/auth/auth-client-utils"
import { safeAsync } from "~/vertex/utils/safe-async"
import { nextAuthGoogleSignIn, nextAuthSignIn } from "~/vertex/modules/auth/auth-controllers"

// Todo - The authentication flow and error handling needs more work...

const providers = [
  Google({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),

  Credentials({
    name: "credentials",
    credentials: {
      id: { label: "id", type: "text", required: false },
      username: { label: "username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const input = $Login.safeParse(credentials)

      if (!input.success) return null

      return await safeAsync(nextAuthSignIn, input.data)
    },
  }),
] satisfies Provider[]

const callbacks: NextAuthConfig["callbacks"] = {
  session: ({ ...props }) => {
    if ("token" in props) {
      props.session.user.id = props.token.id
      props.session.authToken = props.token.authToken
    }

    return props.session
  },

  jwt: async ({ token, user, account }) => {
    switch (account?.provider) {
      case "google": {
        return nextAuthGoogleSignIn(token).catch(() => null)
      }

      case "credentials": {
        if (!user.tokens) return null

        const expiresAt = createTokenExpiry(user.tokens.authToken)

        return {
          ...token,
          ...user.tokens,
          id: user.id!,
          expiresAt,
        }
      }

      default: {
        if (isTokenExpired(token.expiresAt)) {
          const tokens = await refreshAuthToken(token.refreshToken)

          token.authToken = tokens.authToken

          token.expiresAt = +tokens.authTokenExpiration
        }

        return token
      }
    }
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers,
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks,
  pages: {
    signIn: "/login",
  },
})

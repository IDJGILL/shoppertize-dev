import "server-only"
import { wpClient } from "~/vertex/lib/wordpress/wordpress-client"
import {
  PasswordLoginGql,
  GetAuthTokensGql,
  type GetAuthTokensGqlInput,
  type GetAuthTokensGqlOutput,
  type PasswordLoginGqlInput,
  type PasswordLoginGqlOutput,
} from "./auth-gql"
import { env } from "~/env.mjs"

export async function getAuthTokens(props: { username: string; password?: string }) {
  if (props.password) {
    const data = await wpClient<PasswordLoginGqlOutput, PasswordLoginGqlInput>({
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

  const data = await wpClient<GetAuthTokensGqlOutput, GetAuthTokensGqlInput>({
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
}

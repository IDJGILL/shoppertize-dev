import { env } from "~/env.mjs"

const NIMBUS_BASE_URI = "https://api.nimbuspost.com/v1"

type NimbusApiClientOptions = {
  path: string
  payload?: Record<string, unknown>
  method: "POST" | "GET"
}

export const nimbusApiClient = async <TResponse>(
  options: NimbusApiClientOptions,
) => {
  try {
    const authToken = await getNimbusAuthToken()

    if (!authToken) return null

    const request = await fetch(`${NIMBUS_BASE_URI}/${options.path}`, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: options.payload ? JSON.stringify(options.payload) : undefined,
    })

    const data = (await request.json()) as TResponse

    return data
  } catch {
    return null
  }
}

type NimbusAuthData =
  | { status: false; message: string }
  | { status: true; data: string }

export const getNimbusAuthToken = async (): Promise<string | null> => {
  try {
    const request = await fetch(`${NIMBUS_BASE_URI}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: env.NIMBUS_EMAIL,
        password: env.NIMBUS_PASSWORD,
      }),
    })

    const data = (await request.json()) as NimbusAuthData

    if (!data.status) return null

    return data.data
  } catch {
    return null
  }
}

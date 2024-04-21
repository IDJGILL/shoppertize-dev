import { env } from "~/env.mjs"

export type ClientOptions<TInputs> =
  | {
      access: "user"
      query: string
      inputs?: TInputs
      authToken: string
      cacheTags?: string[]
    }
  | {
      access: "admin"
      query: string
      inputs?: TInputs
      cacheTags?: string[]
    }
  | {
      access: "public"
      query: string
      inputs?: TInputs
      cacheTags: string[]
      noCache?: boolean
      method?: "GET" | "POST"
      headers?: Record<string, string>
    }

type FetchOptions = RequestInit & {
  headers: HeadersInit & { Authorization?: string; Origin: string }
  next: NextFetchRequestConfig
}

export const client = async <TData, TInputs = unknown>(
  props: ClientOptions<TInputs>,
) => {
  let endPoint = `${env.BACKEND_DOMAIN}/graphql`

  const options: FetchOptions = {
    headers: {
      "Content-Type": "application/json",
      Origin: env.NEXT_PUBLIC_FRONTEND_DOMAIN,
    },
    cache: "force-cache",
    next: { tags: [] },
  }

  switch (props.access) {
    case "user": {
      options.method = "POST"

      options.headers.Authorization = `Bearer ${props.authToken}`

      options.cache = "no-store"

      options.next.tags = props.cacheTags ?? []

      options.body = JSON.stringify({
        query: props.query,
        variables: props.inputs,
      })

      break
    }

    case "admin": {
      const username = env.WORDPRESS_APPLICATION_USERNAME
      const password = env.WORDPRESS_APPLICATION_SECRET

      options.method = "POST"

      options.headers.Authorization = "Basic " + btoa(`${username}:${password}`)

      options.body = JSON.stringify({
        query: props.query,
        variables: props.inputs,
      })

      options.next.tags = props.cacheTags ?? []

      options.cache = "no-store"

      break
    }

    case "public": {
      options.next.tags = props.cacheTags

      if (props.headers) {
        options.headers = { ...options.headers, ...props.headers }
      }

      if (props.noCache) {
        options.cache = "no-store"
      }

      if (props.method !== "POST") {
        const urlQueryString = new URLSearchParams({
          query: props.query,
        })

        if (props.inputs) {
          urlQueryString.set("variables", JSON.stringify(props.inputs))
        }

        endPoint = `${endPoint}?${urlQueryString.toString()}`

        options.method = "GET"

        break
      }

      if (props.method === "POST") {
        options.method = "POST"

        options.body = JSON.stringify({
          query: props.query,
          variables: props.inputs,
        })
      }

      break
    }
  }

  const response = await fetch(endPoint, options)

  if (!response.ok) throw new Error(response.statusText)

  const json = (await response.json()) as {
    data: TData
    errors?: string[]
  }

  if (!!json.errors?.length) {
    console.log("GRAPHQL ERROR: ", json.errors)
  }

  if (json.errors?.length ?? !json.data) throw new Error()

  return json.data
}

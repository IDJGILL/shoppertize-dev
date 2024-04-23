import { env } from "~/env.mjs"
import { base64 } from "~/lib/utils/functions/base64"

type WooClientPath = "customers" | "wallet" | "orders"

type WooClientProps = {
  id?: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: WooClientPath
  data?: DynamicObject<unknown>
  cacheConfig: "force-cache" | "no-cache"
  params?: Record<string, string>
}

export const wooClient = async <TData>(props: WooClientProps) => {
  try {
    const params = new URLSearchParams(props.params).toString()

    const endpoint = `${env.BACKEND_DOMAIN}/wp-json/wc/v3/${props.id ? props.path + "/" + props.id : props.params ? props.path + "?" + params : props.path}`

    const res = await fetch(endpoint, {
      method: props.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + base64.create([env.WOOCOMMERCE_CONSUMER_KEY, env.WOOCOMMERCE_CONSUMER_SECRET]),
      },
      ...(props.data && { body: JSON.stringify(props.data) }),
      cache: props.cacheConfig,
    })

    if (!res.ok) throw new Error("Something went wrong.")

    const json = (await res.json()) as TData

    return json
  } catch {
    throw new Error("Internal server error")
  }
}

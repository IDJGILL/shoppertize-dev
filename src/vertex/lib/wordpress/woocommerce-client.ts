import { env } from "~/env.mjs"
import { base64 } from "~/lib/utils/functions/base64"

type WooClientPath = "customers"

type WooClientProps = {
  id?: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: WooClientPath
  data: DynamicObject<unknown> | undefined
  cacheConfig: "force-cache" | "no-cache"
}

export const wooClient = async <TData>(props: WooClientProps) => {
  try {
    const endpoint = `${env.BACKEND_DOMAIN}/wp-json/wc/v3/${props.id ? props.path + "/" + props.id : props.path}`

    const res = await fetch(endpoint, {
      method: props.method,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          base64.create([
            env.WOOCOMMERCE_CONSUMER_KEY,
            env.WOOCOMMERCE_CONSUMER_SECRET,
          ]),
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

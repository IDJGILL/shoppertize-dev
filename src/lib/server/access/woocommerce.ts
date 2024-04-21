import { env } from "~/env.mjs"

export const woocommerce = async <TData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  data: DynamicObject<unknown> | undefined,
  cacheConfig: "force-cache" | "no-cache",
) => {
  const res = await fetch(`${env.BACKEND_DOMAIN}/wp-json/wc/v3/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(
          `${env.WOOCOMMERCE_CONSUMER_KEY}:${env.WOOCOMMERCE_CONSUMER_SECRET}`,
        ),
    },
    ...(data && { body: JSON.stringify(data) }),
    cache: cacheConfig,
  })

  const json = (await res.json()) as TData

  return json
}

import "server-only"
import { cookies } from "next/headers"
import { type Serviceability } from "./courier-types"

export function getPostcodeCookie() {
  const values = cookies().get("_postcode-store")?.value

  if (!values) return null

  return JSON.parse(values) as Serviceability
}

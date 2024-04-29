import { cookies } from "next/headers"
import "server-only"

export function setPostcodeCookie(postcode: string) {
  cookies().set("_postcode-store", postcode, {
    expires: 3.456e7,
    sameSite: true,
  })
}

export function getPostcodeCookie() {
  return cookies().get("_postcode-store")?.value ?? null
}

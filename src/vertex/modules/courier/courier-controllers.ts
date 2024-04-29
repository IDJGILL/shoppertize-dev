import "server-only"
import { cookies } from "next/headers"
import { nimbusAdapter } from "~/vertex/lib/nimbus/nimbus-client"
import { getCurrentAddress } from "../address/address-server-utils"
import { setPostcodeCookie } from "./courier-server-utils"

export const setPostcode = async (postcode: string) => {
  const data = await nimbusAdapter.serviceability(122001, +postcode)

  setPostcodeCookie(postcode)

  return data
}

export const getPostcodeServiceability = async (uid?: string) => {
  if (!uid) {
    const postcode = cookies().get("_postcode-store")?.value

    if (!postcode) return null

    return await nimbusAdapter.serviceability(122001, +postcode)
  }

  const address = await getCurrentAddress(uid)

  if (!address) return null

  setPostcodeCookie(address.postcode)

  return await nimbusAdapter.serviceability(122001, +address.postcode)
}

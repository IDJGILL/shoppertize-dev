import "server-only"
import { cookies } from "next/headers"
import { nimbusAdapter } from "~/vertex/lib/nimbus/nimbus-client"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import { type Serviceability } from "./courier-types"

export const checkIndianPostcode = async (postcode: string) => {
  const data = await nimbusAdapter.serviceability(122001, +postcode)

  if (!data) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "Invalid postcode, please check you postcode and try again.",
    })
  }

  cookies().set("_postcode", JSON.stringify({ ...data, checkedAt: new Date().getTime() } satisfies Serviceability), {
    maxAge: 864000,
  })

  return data
}

export const getPostcodeServiceability = async () => {
  const value = await new Promise<string | undefined>((resolve) => resolve(cookies().get("_postcode")?.value))

  if (!value) return null

  const data = JSON.parse(value) as Serviceability

  const currentTime = new Date().getTime()

  if (currentTime > data.checkedAt + 600000) {
    return await checkIndianPostcode(data.postcode)
  }

  return data
}

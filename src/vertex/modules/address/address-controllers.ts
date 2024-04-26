import "server-only"

import otpless from "~/vertex/lib/otpless/otpless-config"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { addOrUpdateAddress, getAddressOptionsFromMeta, sendAddressOtp } from "./address-server-utils"
import type { AddressSession, VerifyAddressProps } from "./address-types"
import { redisDelete, redisGet } from "~/vertex/lib/redis/redis-utils"
import { type Shipping } from "./address-models"

export const addressHandler = async (input: Shipping, authToken: string): Promise<string | null> => {
  const { addresses, uid } = await getAddressOptionsFromMeta(authToken)

  if (addresses.length >= 5) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: "Address maximum limit reached." })
  }

  const existing = addresses.find((a) => a.id === input.id)

  if (!existing) {
    const id = await sendAddressOtp(input, "add")

    return id
  }

  const isNumberChanged = existing.phone !== input.phone

  if (isNumberChanged) {
    const id = await sendAddressOtp(input, "update")

    return id
  }

  await addOrUpdateAddress({ uid, addresses: addresses, address: input, authToken })

  return null
}

export async function verifyAddress(props: VerifyAddressProps) {
  const { addresses, uid } = await getAddressOptionsFromMeta(props.authToken)

  const session = await redisGet<AddressSession>({ id: props.id, idPrefix: "@session/address" })

  if (!session) throw new ExtendedError({ code: "NOT_FOUND" })

  const response2 = await otpless.verify(session.token, props.otp)

  if (!response2.success) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: response2.message })
  }

  await addOrUpdateAddress({
    uid,
    addresses: addresses,
    authToken: props.authToken,
    address: session.address,
  })

  await redisDelete({ id: props.id, idPrefix: "@session/address" })
}

export const getAddressById = async (authToken: string, id: string) => {
  const { addresses } = await getAddressOptionsFromMeta(authToken)

  const exists = addresses.find((a) => a.id === id)

  if (!exists) return null

  return exists
}

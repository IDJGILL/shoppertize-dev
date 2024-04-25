import "server-only"

import type { Address } from "./address-models"
import otpless from "~/vertex/lib/otpless/otpless-config"
import { getAddressOptions } from "./address-queries"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { addOrUpdateAddress, reshapeAddress, sendAddressOtp } from "./address-server-utils"
import type { AddressOtpSession, VerifyAddressProps } from "./address-types"
import { redisDelete, redisGet } from "~/vertex/lib/redis/redis-utils"

export const addressHandler = async (input: Address, authToken: string): Promise<string | null> => {
  const { addresses, email, uid } = await getAddressOptions(authToken)

  if (addresses.length >= 5) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: "Address maximum limit reached." })
  }

  const address = reshapeAddress({ id: input.addressId, address: input, notificationEmail: email })

  const existing = addresses.find((a) => a.id === input.addressId)

  if (!existing) {
    const id = await sendAddressOtp(address, "add")

    return id
  }

  const isNumberChanged = existing.address.shipping.phone !== input.shipping_phone

  if (isNumberChanged) {
    const id = await sendAddressOtp(address, "update")

    return id
  }

  await addOrUpdateAddress({ uid, addresses: addresses, address, authToken })

  return null
}

export async function verifyAddress(props: VerifyAddressProps) {
  const { addresses, uid } = await getAddressOptions(props.authToken)

  const response1 = await redisGet<AddressOtpSession>({ id: props.id, idPrefix: "@session/address" })

  if (!response1) throw new ExtendedError({ code: "NOT_FOUND" })

  const response2 = await otpless.verify(response1.token, props.otp)

  if (!response2.success) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: response2.message })
  }

  await addOrUpdateAddress({
    uid,
    addresses: addresses,
    authToken: props.authToken,
    address: { id: response1.id, address: response1.address },
  })

  await redisDelete({ id: props.id, idPrefix: "@session/address" })
}

import "server-only"

import otpless from "~/vertex/lib/otpless/otpless-config"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { getAddressOptions, getAllowedCountries, sendAddressOtp } from "./address-server-utils"
import type { AddressSession, VerifyAddress, VerifyAddressProps } from "./address-types"
import { redisCreate, redisDelete, redisGet, redisUpdate } from "~/vertex/lib/redis/redis-utils"
import { type Shipping } from "./address-models"

export const addressHandler = async (uid: string, input: Shipping): Promise<string | null> => {
  const options = await getAddressOptions(uid)

  const existing = options.find((a) => a.id === input.id)

  if (!existing) {
    const id = await sendAddressOtp(input, "add")

    return id
  }

  const isNumberChanged = existing.phone !== input.phone

  if (isNumberChanged) {
    const id = await sendAddressOtp(input, "update")

    return id
  }

  await updateAddress(uid, input, options)

  return null
}

export async function verifyAddress(props: VerifyAddressProps) {
  const prev = await getAddressOptions(props.uid)

  const session = await redisGet<VerifyAddress>({ id: props.id, idPrefix: "@verify/address" })

  if (!session) throw new ExtendedError({ code: "NOT_FOUND" })

  const response2 = await otpless.verify(session.token, props.otp)

  if (!response2.success) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: response2.message })
  }

  switch (session.action) {
    case "add": {
      await addAddress(props.uid, session.address, prev)

      break
    }

    case "update": {
      await updateAddress(props.uid, session.address, prev)

      break
    }
  }

  await redisDelete({ id: props.id, idPrefix: "@verify/address" })
}

export async function addAddress(uid: string, input: Shipping, options: Shipping[]) {
  if (options.length === 5) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "Limit reached, please remove or update existing address.",
    })
  }

  if (options.length === 0) {
    return await redisCreate<AddressSession>({
      id: uid,
      idPrefix: "@session/address",
      payload: { options: [{ ...input, isSelected: true, isDefault: true }] },
    })
  }

  const updatedOptions = [...options, input].reduce<Shipping[]>((acc, item) => {
    acc.push({
      ...item,
      isDefault: input.isDefault && item.id !== input.id ? false : item.isDefault,
      isSelected: item.id === input.id,
    })

    return acc
  }, [])

  await redisUpdate<AddressSession>({
    id: uid,
    idPrefix: "@session/address",
    payload: { options: updatedOptions },
  })
}

export async function updateAddress(uid: string, input: Shipping, options: Shipping[]) {
  const updatedOptions = options.reduce<Shipping[]>((acc, item) => {
    if (item.id === input.id) {
      acc.push({ ...input, isDefault: options.length === 1 ? true : input.isDefault, isSelected: true })

      return acc
    }

    acc.push({ ...item, isDefault: input.isDefault ? false : item.isDefault, isSelected: false })

    return acc
  }, [])

  await redisUpdate<AddressSession>({
    id: uid,
    idPrefix: "@session/address",
    payload: { options: updatedOptions },
  })
}

export const changeAddress = async (uid: string, id: string) => {
  const options = await getAddressOptions(uid)

  const input = options.find((a) => a.id === id)

  if (!input) throw new ExtendedError({ code: "NOT_FOUND" })

  await updateAddress(uid, input, options)
}

export const deleteAddress = async (uid: string, id: string) => {
  const options = await getAddressOptions(uid)

  if (options.length === 0) throw new ExtendedError({ code: "NOT_FOUND" })

  const input = options.find((a) => a.id === id)

  if (!input) throw new ExtendedError({ code: "NOT_FOUND" })

  const updatedOptions = options
    .filter((a) => a.id !== input.id)
    .reduce<Shipping[]>((acc, item, index) => {
      if (index === 0) {
        acc.push({ ...item, isDefault: input.isDefault ? true : item.isDefault, isSelected: index === 0 })

        return acc
      }

      acc.push(item)

      return acc
    }, [])

  await redisUpdate<AddressSession>({ id: uid, idPrefix: "@session/address", payload: { options: updatedOptions } })
}

export const getAddressById = async (uid: string, id: string) => {
  const [options, allowedCountries] = await Promise.all([getAddressOptions(uid), getAllowedCountries()])

  const address = options.find((a) => a.id === id)

  return { address, allowedCountries }
}

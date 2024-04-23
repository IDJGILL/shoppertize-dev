import "server-only"

import { cloneDeep } from "lodash-es"
import type { Address } from "./address-models"
import otpless from "~/vertex/lib/otpless/config"
import { getAddressOptions } from "./address-queries"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { convertAddress, updateAddressMetaData } from "./address-server-utils"
import type { AddAddressOutput, AddressDataItem } from "./address-types"
import { updateAuthSession } from "../auth/auth-server-utils"

export const addressHandler = async (input: Address, authToken: string): Promise<AddAddressOutput> => {
  const { addresses, email, id } = await getAddressOptions(authToken)

  console.log({ addresses }, { count: addresses.length })

  if (addresses.length >= 5) throw new ExtendedError({ code: "BAD_REQUEST", message: "Address maximum limit reached." })

  const existing = addresses.find((a) => a.id === input.address_id)

  const addNewAddress = async () => {
    const data = convertAddress({ address: input, notificationEmail: email })

    const newAddress = {
      ...data,
      address: {
        ...data.address,
        shipping: {
          ...data.address.shipping,
          isDefault: addresses.length === 0,
        },
      },
    } satisfies AddressDataItem

    const mergeAddressList = [
      ...addresses.map((a) => ({
        ...a,
        address: {
          ...a.address,
          shipping: {
            ...a.address.shipping,
            isDefault: input.isDefault ? false : a.address.shipping.isDefault,
          },
        },
      })),
      newAddress,
    ]

    await Promise.all([
      updateAuthSession({ id: id.toString(), key: "currentAddress", data: { currentAddress: newAddress } }),
      updateAddressMetaData({ list: mergeAddressList, item: newAddress, authToken }),
    ])

    return { token: null }
  }

  const updateExistingAddress = async (existing: AddressDataItem) => {
    const existingAddressIndex = addresses.findIndex((a) => a.id === existing.id)

    const addressListClone = cloneDeep(addresses)

    const updatedAddress = convertAddress({ id: existing.id, address: input, notificationEmail: email })

    addressListClone[existingAddressIndex] = updatedAddress

    const mergeAddressList = [
      ...addressListClone.map((a) => {
        if (input.isDefault && a.id !== updatedAddress.id) {
          return {
            ...a,
            address: {
              ...a.address,
              shipping: {
                ...a.address.shipping,
                isDefault: false,
              },
            },
          }
        }

        return a
      }),
    ]

    await Promise.all([
      updateAuthSession({ id: id.toString(), key: "currentAddress", data: { currentAddress: updatedAddress } }),
      updateAddressMetaData({ list: mergeAddressList, item: updatedAddress, authToken }),
    ])

    return { token: null }
  }

  if (input.token && input.otp) {
    const verify = await otpless.verify(input.token, input.otp)

    if (!verify.success) throw new ExtendedError({ code: "BAD_REQUEST", message: verify.message })

    if (existing) return await updateExistingAddress(existing)

    return await addNewAddress()
  }

  const needToVerify = addresses.length === 0 || !existing || existing.address.shipping.phone !== input.shipping_phone

  if (needToVerify) {
    const sms = await otpless.send(input.shipping_phone)

    return { token: sms.token }
  }

  return await updateExistingAddress(existing)
}

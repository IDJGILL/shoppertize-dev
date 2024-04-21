"use server"

import { authAction, response } from "~/vertex/lib/action"
import { $Address } from "./address-schema"
import { convertAddress, updateAddressMetaData } from "./address-server-utils"
import otpless from "~/lib/utils/functions/otpless"
import { cloneDeep } from "lodash-es"
import { type AddressDataItem } from "./address-types"
import { getAddressOptions } from "./address-queries"

export const addAddress = authAction($Address, async (input, ctx) => {
  const { user, authToken } = ctx.session

  const addressList = await getAddressOptions(+user.id)

  if (addressList.length >= 5) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "You can only add 5 address to your account.",
    })
  }

  if (addressList.some((a) => a.id === input.address_id)) {
    return ctx.response.error({
      code: "BAD_REQUEST",
      message: "Address already exists.",
    })
  }

  if (!input.shipping_token) {
    const sms = await otpless.send(input.shipping_phone)

    return response.success({
      message: "Your need to verify your phone number.",
      data: { token: sms.token },
    })
  }

  if (!input.shipping_otp) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "Please enter otp",
    })
  }

  const verify = await otpless.verify(input.shipping_token, input.shipping_otp)

  if (!verify.success) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: verify.message,
    })
  }

  const data = convertAddress({
    address: input,
    notificationEmail: user.email,
  })

  const isEmptyAddressList = addressList.length === 0

  const newAddress = {
    ...data,
    address: {
      ...data.address,
      shipping: {
        ...data.address.shipping,
        isDefault: isEmptyAddressList,
      },
    },
  } satisfies AddressDataItem

  const mergeAddressList = [
    ...addressList.map((a) => ({
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

  await updateAddressMetaData({
    list: mergeAddressList,
    item: newAddress,
    authToken,
  })

  return response.success({
    data: null,
    revalidatePaths: ["/cart"],
  })
})

export const updateAddress = authAction($Address, async (input, ctx) => {
  const { user, authToken } = ctx.session

  const addressList = await getAddressOptions(+user.id)

  const existing = addressList.find((a) => a.id === input.address_id)

  if (!existing) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "Address does not exist, Please create a new one.",
    })
  }

  /**
   * A internal helper function to call update from different conditions
   */
  const update = async () => {
    const existingAddressIndex = addressList.findIndex((a) => a.id === existing.id)

    const addressListClone = cloneDeep(addressList)

    const updatedAddress = convertAddress({
      id: existing.id,
      address: input,
      notificationEmail: user.email,
    })

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

    await updateAddressMetaData({
      list: mergeAddressList,
      item: updatedAddress,
      authToken,
    })

    return response.success({
      data: null,
      revalidatePaths: ["/cart"],
    })
  }

  /**
   * This means that we sent a otp verification to user
   * then we need to check the otp and verify the phone number
   * If otp verifies we update the address.
   */
  if (input.shipping_token) {
    if (!input.shipping_otp) {
      throw new ExtendedError({
        code: "BAD_REQUEST",
        message: "Please enter otp",
      })
    }

    const verify = await otpless.verify(input.shipping_token, input.shipping_otp)

    if (!verify.success) {
      throw new ExtendedError({
        code: "BAD_REQUEST",
        message: verify.message,
      })
    }

    return await update()
  }

  /**
   * This means that user has changed/edited the phone number
   * Now we need to send him/her a verification code.
   */
  if (existing.address.shipping.phone !== input.shipping_phone) {
    const sms = await otpless.send(input.shipping_phone)

    return response.success({
      message: "Your need to verify your phone number.",
      data: { token: sms.token },
    })
  }

  return await update()
})

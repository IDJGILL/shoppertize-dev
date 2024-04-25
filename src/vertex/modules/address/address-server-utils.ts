import "server-only"

import { type Address } from "./address-models"
import { client } from "~/lib/graphql/client"
import {
  UpdateUserMetaDataGql,
  type UpdateUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlResponse,
} from "~/lib/modules/auth/auth-gql"
import { nanoid } from "nanoid"
import type { AddressOtpSession, AddressData, AddOrUpdateAddress } from "./address-types"
import { getAuthSession } from "../auth/auth-server-utils"
import { redisCreate, redisUpdate } from "~/vertex/lib/redis/redis-utils"
import type { AuthSession } from "~/vertex/global/types"
import { cloneDeep } from "lodash-es"
import otpless from "~/vertex/lib/otpless/otpless-config"

export function reshapeAddress(props: { id?: string; address: Address; notificationEmail: string }): AddressData {
  return {
    id: props.id ?? nanoid(),
    address: {
      shipping: {
        first_name: props.address.shipping_firstName,

        last_name: props.address.shipping_lastName,

        address_1: props.address.shipping_address1,

        address_2: props.address.shipping_address2,

        city: props.address.shipping_city,

        state: "DL",

        phone: props.address.shipping_phone,

        postcode: props.address.shipping_postcode,

        email: props.notificationEmail,

        country: props.address.shipping_country,

        isDefault: props.address.isDefault,
      },

      billing: props.address.isTaxInvoice
        ? {
            first_name: props.address.billing_firstName,

            last_name: "",

            company: props.address.billing_tax,

            address_1: props.address.billing_address1,

            address_2: props.address.billing_address2,

            city: props.address.billing_city,

            state: props.address.billing_state,

            postcode: props.address.billing_postcode,

            country: props.address.billing_country,

            email: props.notificationEmail,

            phone: props.address.billing_phone,
          }
        : null,
    },
  }
}

export async function updateAddressMetaData(props: { list: AddressData[]; item: AddressData; authToken: string }) {
  const isDefault = props.item.address.shipping.isDefault

  const metaDataItems = [
    { key: "address-options", value: JSON.stringify(props.list) },
    { key: "address-selected", value: JSON.stringify(props.item) },
    {
      key: "address-default",
      value: isDefault ? JSON.stringify(props.item) : "",
    },
  ] satisfies MetaData[]

  await client<UpdateUserMetaDataGqlResponse, UpdateUserMetaDataGqlInput>({
    access: "user",
    query: UpdateUserMetaDataGql,
    inputs: {
      key: "address-options",
      metaData: metaDataItems,
    },
    authToken: props.authToken,
  })
}

export async function getCurrentAddressFromSession(uid: string) {
  const data = await getAuthSession(uid)

  return data?.currentAddress ?? null
}

export async function sendAddressOtp(input: AddressData, action: AddressOtpSession["action"]): Promise<string> {
  const response1 = await otpless.send(input.address.shipping.phone)

  const response2 = await redisCreate<AddressOtpSession>({
    idPrefix: "@session/address",
    payload: { action: action, address: input.address, token: response1.token },
    ttlSec: 5 * 60,
  })

  return response2.id
}

export async function addOrUpdateAddress(props: AddOrUpdateAddress) {
  // Clone the addresses array
  const updatedList = cloneDeep(props.addresses)

  if (props.address.address.shipping.isDefault) {
    // If the new address is set to default, update other addresses to be not default
    updatedList.forEach((address) => {
      if (address.id !== address.id) {
        address.address.shipping.isDefault = false
      }
    })
  }

  // Check if the address already exists in the cloned list
  const existingAddressIndex = updatedList.findIndex((address) => address.id === address.id)

  if (existingAddressIndex !== -1) {
    // If the address already exists, update it
    updatedList[existingAddressIndex] = props.address
  } else {
    // If the address doesn't exist, add it to the cloned list
    updatedList.push(props.address)
  }

  await Promise.all([
    updateAddressMetaData({ list: updatedList, item: props.address, authToken: props.authToken }),
    redisUpdate<AuthSession>({ id: props.uid, idPrefix: "@session/auth", payload: { currentAddress: props.address } }),
  ])
}

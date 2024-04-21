import "server-only"

import { type Address } from "./address-schema"
import { findState } from "~/lib/utils/functions/find-state-by-value"
import { client } from "~/lib/graphql/client"
import {
  UpdateUserMetaDataGql,
  type UpdateUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlResponse,
} from "~/lib/modules/auth/auth-gql"
import { nanoid } from "nanoid"
import { type AddressDataItem } from "./address-types"

export const convertAddress = (props: {
  id?: string
  address: Address
  notificationEmail: string
}) => {
  return {
    id: props.id ?? nanoid(),
    address: {
      shipping: {
        firstName: props.address.shipping_firstName,
        lastName: props.address.shipping_lastName,
        address1: props.address.shipping_address1,
        address2: props.address.shipping_address2,
        phone: props.address.shipping_phone,
        postcode: props.address.shipping_postcode,
        city: props.address.shipping_city,
        state: findState({
          type: "name",
          return: "code",
          value: props.address.shipping_state,
        }),
        email: props.notificationEmail,
        country: props.address.shipping_country,
        isDefault: props.address.isDefault,
      },

      billing: props.address.isTaxInvoice
        ? {
            firstName: props.address.billing_firstName,
            lastName: "",
            address1: props.address.billing_address1,
            address2: props.address.billing_address2,
            phone: props.address.billing_phone,
            postcode: props.address.billing_postcode,
            city: props.address.billing_city,
            state: findState({
              type: "name",
              return: "code",
              value: props.address.billing_state,
            }),
            email: props.notificationEmail,
            company: props.address.billing_tax,
            country: props.address.billing_country,
          }
        : null,
    },
  }
}

export const updateAddressMetaData = async (props: {
  list: AddressDataItem[]
  item: AddressDataItem
  authToken: string
}) => {
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

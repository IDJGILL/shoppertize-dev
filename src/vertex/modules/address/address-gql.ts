import type { BillingAddress, ShippingAddress } from "./address-types"

export const UpdateAddressGql = `
mutation UpdateAddressGql($metaData: [MetaDataInput] = {key: "", value: ""}, $key: String = "", $billing: CustomerAddressInput = {}, $shipping: CustomerAddressInput = {}) {
  updateCustomer(
    input: {metaData: $metaData, billing: $billing, shipping: $shipping}
  ) {
    customer {
      metaData(key: $key) {
        key
        value
      }
    }
  }
}
`

export type UpdateAddressGqlResponse = {
  updateCustomer: {
    customer: Pick<GqlDataProps, "metaData">
  }
}

export type UpdateAddressGqlInput = Pick<GqlInputProps, "metaData" | "key"> & {
  billing: BillingAddress
  shipping: ShippingAddress
}

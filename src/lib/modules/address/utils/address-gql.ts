import type { BillingAddress, ShippingAddress } from "./address-types"

export const GetBothAddressesGql = `
query GetBothAddressesGql {
  customer {
    shipping {
      firstName
      lastName
      email
      phone
      postcode
      city
      state
      country
      address1
      address2
    }
    billing {
      firstName
      lastName
      email
      phone
      postcode
      city
      state
      country
      address1
      address2
      company
    }
  }
}
`

export type GetBothAddressesGqlResponse = {
  customer: {
    shipping: Pick<
      GqlDataProps,
      | "firstName"
      | "lastName"
      | "email"
      | "phone"
      | "postcode"
      | "city"
      | "state"
      | "country"
      | "address1"
      | "address2"
    >
    billing: Pick<
      GqlDataProps,
      | "firstName"
      | "lastName"
      | "email"
      | "phone"
      | "postcode"
      | "city"
      | "state"
      | "country"
      | "address1"
      | "address2"
      | "company"
    >
  }
}

export const GetShippingAddressGql = `
query GetShippingAddressGql {
  customer {
    shipping {
      firstName
      lastName
      email
      phone
      postcode
      city
      state
      country
      address1
      address2
    }
  }
}
`

export type GetShippingAddressGqlResponse = {
  customer: {
    shipping: GetBothAddressesGqlResponse["customer"]["shipping"]
  }
}

export const GetBillingAddressGql = `
query GetBillingAddressGql {
  customer {
    billing {
      firstName
      lastName
      email
      phone
      postcode
      city
      state
      country
      address1
      address2
      company
    }
  }
}
`

export type GetBillingAddressGqlResponse = {
  customer: {
    billing: GetBothAddressesGqlResponse["customer"]["billing"]
  }
}

export const UpdateShippingAddressGql = `
mutation UpdateShippingAddressGql($shipping: CustomerAddressInput = {}) {
  updateCustomer(input: {shipping: $shipping}) {
    refreshToken
  }
}`

export type UpdateShippingAddressGqlInput = {
  shipping: RemoveNullable<ShippingAddress>
}

export const UpdateBillingAddressGql = `
mutation UpdateBillingAddressGql($billing: CustomerAddressInput = {}) {
  updateCustomer(input: {billing: $billing}) {
    refreshToken
  }
}`

export type UpdateBillingAddressGqlInput = {
  billing: RemoveNullable<BillingAddress>
}

export const UpdateBothAddressGql = `
mutation UpdateBothAddressGql($billing: CustomerAddressInput = {}, $shipping: CustomerAddressInput = {}) {
  updateCustomer(input: {billing: $billing, shipping: $shipping}) {
    refreshToken
  }
}`

export type UpdateBothAddressInput = {
  shipping: RemoveNullable<ShippingAddress>
  billing: RemoveNullable<BillingAddress>
}
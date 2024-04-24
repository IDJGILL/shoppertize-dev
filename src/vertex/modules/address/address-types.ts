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
      "firstName" | "lastName" | "email" | "phone" | "postcode" | "city" | "state" | "country" | "address1" | "address2"
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

export type ShippingAddress = GetBothAddressesGqlResponse["customer"]["shipping"]

export type BillingAddress = GetBothAddressesGqlResponse["customer"]["billing"]

export type OrderAddresses = {
  shipping: RemoveNullable<ShippingAddress>
  billing?: RemoveNullable<BillingAddress>
}

export type AddressData = {
  id: string
  address: {
    shipping: {
      first_name: string
      last_name: string
      address_1: string
      address_2: string
      city: string
      state: string
      phone: string
      postcode: string
      email: string
      country: string
      isDefault: boolean
    }
    billing: {
      first_name: string
      last_name: string
      company: string
      address_1: string
      address_2: string
      city: string
      state: string
      postcode: string
      country: string
      email: string
      phone: string
    } | null
  }
}

export type AddAddressOutput = { token: string | null }

export type UpdateAddressOutput = { token: string | null }

export type AddressOtpSession = {
  address: AddressData["address"]
  token: string
  action: "add" | "update"
}

export type AddressHandlerOutput = {
  id: string | null
  isVerified: boolean
}

export type AddOrUpdateAddress = {
  uid: string
  addresses: AddressData[]
  address: AddressData
  authToken: string
}

export type VerifyAddressProps = {
  id: string
  otp: string
  authToken: string
}

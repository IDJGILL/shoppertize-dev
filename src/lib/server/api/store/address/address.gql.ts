/* ## Queries ## */

export const GET_ADDRESS = `
query GET_ADDRESS {
  customer {
    billing {
      address1
      city
      country
      email
      firstName
      lastName
      phone
      postcode
      state
      address2
    }
  }
}
`

/* ## Mutations ## */

export const UPDATE_ADDRESS = `
mutation UPDATE_ADDRESS($billing: CustomerAddressInput = {}, $shipping: CustomerAddressInput = {}) {
  updateCustomer(input: {billing: $billing, shipping: $shipping}) {
    refreshToken
  }
}
`

export const GET_CART_TOTAL = `
query GET_CART {
  customer {
    session {
      id
      key
      value
    }
  }
}
`

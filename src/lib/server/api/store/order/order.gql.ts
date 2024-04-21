/* ## Queries ## */

export const GET_NEW_ORDER = `
query GET_NEW_ORDER($customerId: Int = 0, $keysIn: [String] = "") {
  orders(where: {customerId: $customerId, orderby: {field: DATE}}, first: 1) {
    edges {
      node {
        orderNumber
        metaData(keysIn: $keysIn, multiple: true) {
          key
          value
        }
      }
    }
  }
}
`

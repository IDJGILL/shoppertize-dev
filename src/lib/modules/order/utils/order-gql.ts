export const GET_INFINITE_ORDERS = `
query GET_INFINITE_ORDERS($first: Int = 10, $after: String = "", $customerId: Int = 10) {
  orders(first: $first, where: {customerId: $customerId}, after: $after) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        status
        date
        metaData {
          key
          value
        }
        lineItems {
          nodes {
            orderId
            productId
            quantity
            subtotalTax
            product {
              node {
                id
                type
                name
                image {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const GET_SINGLE_ORDER = `
query GET_SINGLE_ORDER($id: ID = 0) {
  order(id: $id, idType: DATABASE_ID) {
    id
    status
    date
    datePaid
    dateCompleted
    discountTotal(format: RAW)
    shippingTotal(format: RAW)
    feeLines {
      nodes {
        name
        total
      }
    }
    subtotal(format: RAW)
    total(format: RAW)
    metaData {
			key
      value
    }
    lineItems {
      nodes {
        orderId
        productId
        quantity
        subtotalTax
        total
        product {
          node {
            id
            type
            name
            image {
              sourceUrl
            }
          }
        }
        variation {
          node {
            attributes {
              nodes {
                id
                label
                name
                value
              }
            }
          }
        }
      }
    }
    shipping {
      firstName
      lastName
      postcode
      phone
      email
      address1
      city
      state
      country
    }
  }
}
`

export const SESSION_QUERY_FOR_ORDER = `
query SESSION_QUERY_FOR_ORDER($customerId: Int, $keysIn: [String] = []) {
  customer(customerId: $customerId) {
    databaseId
    metaData(keysIn: $keysIn) {
      key
      value
    }
    session {
      key
      value
    }
    email
    shipping {
      firstName
      lastName
      postcode
      phone
      email
      address1
      address2
      city
      state
      country
    }
    billing {
      firstName
      lastName
      postcode
      phone
      email
      address1
      address2
      city
      state
      country
      company
    }
  }
  cart(recalculateTotals: true) {
    contents {
      nodes {
        ... on SimpleCartItem {
          product {
            node {
              slug
            }
          }
        }
      }
    }
  }
}
`

export const UPDATE_POST_ORDER_META = `
mutation UPDATE_POST_ORDER_META($metaData: [MetaDataInput] = {key: "", value: ""}, $sessionData: [MetaDataInput] = {key: "", value: ""}) {
  emptyCart(input: {clearPersistentCart: true}) {
    clientMutationId
  }
  updateCustomer(input: {metaData: $metaData}) {
    clientMutationId
  }
  updateSession(input: {sessionData: $sessionData}) {
    clientMutationId
  }
}
`

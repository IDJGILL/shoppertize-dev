/* ## Queries ## */

export const GET_DATA_FOR_PLACE_ORDER = `
query GET_DATA_FOR_PLACE_ORDER($customerId: Int, $keysIn: [String] = []) {
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
    availableShippingMethods {
      packageDetails
      supportsShippingCalculator
      rates {
        cost
        id
        instanceId
        label
        methodId
      }
    }
  }
}
`

export const GET_ITEMS_FOR_VALIDATION = `
query GET_ITEMS_FOR_VALIDATION($include: [Int]) {
  products(where: {include: $include, status: "published"}) {
    nodes {
      type
      ... on SimpleProduct {
        databaseId
        stockQuantity
        stockStatus
        productSettings {
          hasCashOnDelivery
          hasReturnExchange
        }
      }
      ... on VariableProduct {
        databaseId
        productSettings {
          hasCashOnDelivery
          hasReturnExchange
        }
        variations {
          nodes {
            databaseId
            stockQuantity
            stockStatus
          }
        }
      }
    }
  }
}

`

export const GET_INITIAL_SESSION = `
query GET_INITIAL_SESSION {
  customer {
    session {
      id
      key
      value
    }
  }
  cart {
    chosenShippingMethods
    availableShippingMethods {
      packageDetails
      supportsShippingCalculator
      rates {
        cost
        id
        instanceId
        label
        methodId
      }
    }
    appliedCoupons {
      code
    }
  }
  coupons {
    nodes {
      id
      amount
      code
      dateExpiry
      description
      discountType
      individualUse
      maximumAmount
      minimumAmount
      usageLimitPerUser
    }
  }
}
`

export const GET_CHECKOUT_SESSION = `
query GET_CHECKOUT_SESSION {
  customer {
    email
    metaData {
      id
      key
      value
    }
    session {
      id
      key
      value
    }
    shipping {
      address1
      address2
      city
      country
      email
      firstName
      lastName
      phone
      postcode
      state
    }
  }
  cart(recalculateTotals: true) {
    contentsTotal(format: RAW)
    discountTotal(format: RAW)
    shippingTotal(format: RAW)
    subtotal(format: RAW)
    total(format: RAW)
    contents {
      nodes {
        ... on SimpleCartItem {
          key
          quantity
          product {
            node {
              productSettings {
                hasCashOnDelivery
                hasReturnExchange
                allowedShippingPincodes
                allowedShippingStates
              }
              ... on SimpleProduct {
                id
                name
                regularPrice(format: RAW)
                salePrice(format: RAW)
                stockStatus
                stockQuantity
                image {
                  sourceUrl
                }
                productCategories {
                  nodes {
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
    availableShippingMethods {
      packageDetails
      supportsShippingCalculator
      rates {
        cost
        id
        instanceId
        label
        methodId
      }
    }
    appliedCoupons {
      code
      discountAmount(format: RAW)
    }
  }
}
`

export const GET_CUSTOMER_DETAILS = `
query GET_CUSTOMER_DETAILS($customerId: Int, $key: String = "") {
  customer(customerId: $customerId) {
    metaData(key: $key) {
      key
      value
    }
  }
}
`

/* ## Mutations ## */

export const UPDATE_POST_ORDER_DETAILS = `
mutation UPDATE_POST_ORDER_DETAILS($metaData: [MetaDataInput] = {key: "", value: ""}, $sessionData: [MetaDataInput] = {key: "", value: ""}) {
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

export const UPDATE_SESSION = `
mutation RESET_SESSION($sessionData: [MetaDataInput] = {key: "", value: ""}) {
  updateSession(input: {sessionData: $sessionData}) {
    clientMutationId
  }
}
`

export const UPDATE_SHIPPING_METHOD = `
mutation UPDATE_SHIPPING_METHOD($shippingMethods: [String] = "") {
  updateShippingMethod(input: {shippingMethods: $shippingMethods}) {
    clientMutationId
  }
}
`

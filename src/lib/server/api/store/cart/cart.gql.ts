/* ## Queries ## */
export const GET_CART = `
query GET_CART {
  cart {
    contents {
      nodes {
        key
        ... on SimpleCartItem {
          key
          product {
            node {
              id
            }
          }
        }
        variation {
          node {
            id
            stockQuantity
            stockStatus
            taxClass
            taxStatus
          }
        }
        quantity
        product {
          node {
            type
            ... on SimpleProduct {
              id
              name
              image {
                sourceUrl
              }
              productSettings {
                allowedShippingPincodes
                allowedShippingStates
              }
              price(format: RAW)
              regularPrice(format: RAW)
              stockQuantity
              stockStatus
              taxClass
              taxStatus
            }
            ... on VariableProduct {
              id
              attributes {
                nodes {
                  id
                  name
                  label
                  options
                  variation
                  visible
                }
              }
              variations {
                nodes {
                  id
                  type
                  name
                  price(format: RAW)
                  regularPrice(format: RAW)
                  image {
                    sourceUrl
                  }
                  attributes {
                    nodes {
                      id
                      label
                      name
                      value
                    }
                  }
                  stockQuantity
                  stockStatus
                  taxClass
                  taxStatus
                }
              }
            }
          }
        }
      }
    }
  }
  customer {
    shipping {
      postcode
      state
      city
    }
  }
}
`

export const GET_CART_FOR_MERGED_CART = `
query GET_CART_FOR_MERGED_CART {
  cart {
    contents {
      nodes {
        ... on SimpleCartItem {
          quantity
          product {
            node {
              id
              ... on SimpleProduct {
                stockQuantity
                stockStatus
                taxClass
                taxStatus
              }
            }
          }
        }
        variation {
          node {
            id
            stockQuantity
            stockStatus
            taxClass
            taxStatus
          }
        }
      }
    }
  }
}
`

export const GET_VARIATION_STOCK_DETAILS = `
query GET_VARIATION_STOCK_DETAILS($id: ID = "") {
  product(id: $id, idType: DATABASE_ID) {
    ... on VariableProduct {
      id
      variations {
        nodes {
          id
          stockQuantity
          stockStatus
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
}
`

export const GET_PRODUCT_STOCK_STATUS = `
query GET_PRODUCT_STOCK_STATUS($id: ID = "") {
  product(id: $id, idType: DATABASE_ID) {
    id
    type
    ... on SimpleProduct {
      databaseId
      stockQuantity
      stockStatus
    }
    ... on VariableProduct {
      variations {
        nodes {
          id
          databaseId
          stockQuantity
          stockStatus
        }
      }
    }
  }
}
`

export const GET_CART_ITEMS = `
query GET_CART_ITEMS($include: [Int] = []) {
  products(where: {include: $include}) {
    nodes {
      type
      ... on SimpleProduct {
        id
        name
        image {
          sourceUrl
        }
        productSettings {
					allowedShippingPincodes
          allowedShippingStates
        }
        price(format: RAW)
        regularPrice(format: RAW)
        stockQuantity
        stockStatus
        taxClass
        taxStatus
      }
      ... on VariableProduct {
        id
        attributes {
          nodes {
            id
            name
            label
            options
            variation
            visible
          }
        }
        variations {
          nodes {
            id
            type
            name
            price(format: RAW)
            regularPrice(format: RAW)
            image {
              sourceUrl
            }
            attributes {
              nodes {
                id
                label
                name
                value
              }
            }
            stockQuantity
            stockStatus
            taxClass
            taxStatus
          }
        }
      }
    }
  }
}
`

export const GET_CART_ITEMS_COUNT = `
query GET_CART_ITEMS_COUNT {
  customer {
    session {
      key
      value
    }
  }
}
`

/* ## Mutations ## */

export const ADD_MULTIPLE_CART_ITEMS = `
mutation ADD_MULTIPLE_CART_ITEMS($items: [CartItemInput]) {
  addCartItems(input: {items: $items}) {
    cartErrors {
      productId
      reasons
    }
  }
}
`

export const REMOVE_CART_ITEM = `
mutation REMOVE_CART_ITEM($keys: [ID] = "", $all: Boolean = false) {
  removeItemsFromCart(input: {clientMutationId: "", keys: $keys, all: $all}) {
    cart {
      contents {
        nodes {
          key
        }
      }
    }
  }
}
`

export const REPLACE_CART_ITEM = `
mutation REPLACE_CART_ITEM($keys: [ID] = "", $productId: Int = 0, $quantity: Int = 1, $clientMutationId: String = "") {
  removeItemsFromCart(input: {keys: $keys, clientMutationId: $clientMutationId}) {
    clientMutationId
  }
  addToCart(
    input: {productId: $productId, quantity: $quantity, clientMutationId: ""}
  ) {
    clientMutationId
  }
}
`

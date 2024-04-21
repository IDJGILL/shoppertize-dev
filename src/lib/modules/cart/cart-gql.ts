export const GetCartItemsDetailsGql = `
query GetCartItemsDetailsGql {
  cart {
    contents {
      nodes {
        key
        quantity
        product {
          node {
            ... on SimpleProduct {
              id
              type
              name
              image {
                sourceUrl
              }
              productSettings {
                hasCashOnDelivery
                hasReturnExchange
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
          }
        }
      }
    }
  }
}
`

export type GetCartItemsDetailsGqlResponse = {
  cart: {
    contents: {
      nodes: Array<
        Pick<GqlDataProps, "key" | "quantity"> & {
          product: {
            node: Pick<
              GqlDataProps,
              | "id"
              | "type"
              | "name"
              | "image"
              | "price"
              | "regularPrice"
              | "stockQuantity"
              | "stockStatus"
              | "taxClass"
              | "taxStatus"
            > & {
              productSettings: GqlProductSettingsProps
            }
          }
        }
      >
    }
  }
}

export const GetProductDetailsForCartItemsGql = `
query GetProductDetailsForCartItemsGql($include: [Int] = []) {
  products(where: {include: $include}) {
    nodes {
      ... on SimpleProduct {
        id
        type
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
    }
  }
}
`

export type GetProductDetailsForCartItemsGqlResponse = {
  products: {
    nodes: Array<
      Pick<
        GqlDataProps,
        | "id"
        | "type"
        | "name"
        | "image"
        | "price"
        | "regularPrice"
        | "stockQuantity"
        | "stockStatus"
        | "taxClass"
        | "taxStatus"
      > & {
        productSettings: GqlProductSettingsProps
      }
    >
  }
}

export type GetProductDetailsForCartItemsGqlInput = Pick<
  GqlInputProps,
  "include"
>

export const AddToCartGql = `
mutation AddToCartGql($productId: Int = 0, $quantity: Int) {
  addToCart(input: {productId: $productId, quantity: $quantity}) {
    cartItem {
      key
      quantity
    }
  }
}
`

export type AddToCartGqlResponse = {
  addToCart: {
    cartItem: {
      key: string
      quantity: number
    }
  } | null
}

export type AddToCartGqlInput = Pick<GqlInputProps, "productId" | "quantity">

export const UpdateCartItemQuantityGql = `
mutation UpdateCartItemQuantityGql($items: [CartItemQuantityInput] = []) {
  updateItemQuantities(input: {items: $items}) {
    updated {
      key
    }
  }
}
`

export type UpdateCartItemQuantityGqlResponse = {
  updateItemQuantities: {
    updated: {
      key: string
    }
  } | null
}

export type UpdateCartItemQuantityGqlInput = {
  items: CartItemQuantityInput[]
}

export const RemoveCartItemGql = `
mutation RemoveCartItemGql($keys: [ID] = "", $all: Boolean = false) {
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

export type RemoveCartItemGqlInput = Pick<GqlInputProps, "keys" | "all">

export const GetCartItemsCountGql = `
query GetCartItemsCountGql {
  customer {
    session {
      key
      value
    }
  }
}
`

export type GetCartItemsCountGqlProps = {
  customer: {
    session: Pick<GqlDataProps, "metaData">["metaData"]
  }
}

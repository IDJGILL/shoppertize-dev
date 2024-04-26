import type { PickDataFields, PickInputFields } from "~/vertex/global/global-types"

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

export type AddToCartGqlInput = PickInputFields<"productId" | "quantity">

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

export type RemoveCartItemGqlData = {
  cart: {
    contents: {
      nodes: { key: string }[]
    }
  }
}

export type RemoveCartItemGqlInput = PickInputFields<"keys" | "all">

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
    session: PickDataFields<"metaData">["metaData"]
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

/**
 * This query gets all products with details mainly for stock,
 * And data will be stored and in redis database for faster queries
 */
export const GetAllProductsStockDetailsGql = `
query GetAllProductsStockDetailsGql {
  products(first: 1000, where: {status: "publish"}) {
    nodes {
      id
      type
      slug
      ... on SimpleProduct {
        name
        price(format: RAW)
        regularPrice(format: RAW)
        image {
          sourceUrl
        }
        stockStatus
        stockQuantity
        lowStockAmount
        manageStock
        taxStatus
        taxClass
        productSettings {
          allowedShippingPincodes
          allowedShippingStates
          allowedShippingPincodes
          allowedShippingStates
        }
      }
    }
  }
}
`
export type GetAllProductsStockDetailsGqlResponse = {
  products: {
    nodes: (PickDataFields<
      | "id"
      | "type"
      | "slug"
      | "name"
      | "price"
      | "image"
      | "regularPrice"
      | "stockStatus"
      | "stockQuantity"
      | "lowStockAmount"
      | "manageStock"
      | "taxStatus"
      | "taxClass"
    > & {
      productSettings: GqlProductSettingsProps
    })[]
  }
}

export const GetProductStockDetailsGql = `
query GetProductStockDetailsGql($id: ID = "") {
  product(id: $id, idType: DATABASE_ID) {
    id
    type
    slug
    ... on SimpleProduct {
      name
      price(format: RAW)
      regularPrice(format: RAW)
      image {
        sourceUrl
      }
      stockStatus
      stockQuantity
      lowStockAmount
      manageStock
      taxStatus
      taxClass
      productSettings {
        allowedShippingPincodes
        allowedShippingStates
        allowedShippingPincodes
        allowedShippingStates
      }
    }
  }
}
`

export type GetProductStockDetailsGqlResponse = {
  product: PickDataFields<
    | "id"
    | "type"
    | "slug"
    | "name"
    | "price"
    | "image"
    | "regularPrice"
    | "stockStatus"
    | "stockQuantity"
    | "lowStockAmount"
    | "manageStock"
    | "taxStatus"
    | "taxClass"
  > & {
    productSettings: GqlProductSettingsProps
  }
}

export type GetProductStockDetailsGqlInput = {
  id: string
}

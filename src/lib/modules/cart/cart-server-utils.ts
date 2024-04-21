import "server-only"

import { client } from "~/lib/graphql/client"
import {
  AddToCartGql,
  RemoveCartItemGql,
  GetCartItemsDetailsGql,
  UpdateCartItemQuantityGql,
  GetProductDetailsForCartItemsGql,
  type GetCartItemsDetailsGqlResponse,
  type RemoveCartItemGqlInput,
  type UpdateCartItemQuantityGqlInput,
  type UpdateCartItemQuantityGqlResponse,
  type AddToCartGqlResponse,
  type AddToCartGqlInput,
  type GetProductDetailsForCartItemsGqlInput,
  type GetProductDetailsForCartItemsGqlResponse,
} from "./cart-gql"
import { TRPCError } from "@trpc/server"
import { base64 } from "~/lib/utils/functions/base64"
import type {
  CartItemData,
  CartItemRecord,
  ExtendCartItem,
  MainCartItem,
} from "./cart-types"
import { cookies } from "next/headers"
import { calculateGst } from "~/lib/utils/functions/calculate-gst"
import {
  GetProductStockDetailsGql,
  type GetGetProductStockDetailsGqlResponse,
  type GetProductStockDetailsGqlInput,
} from "../product/utils/product-gql"

export async function getCartFromDb(authToken: string) {
  const request = await client<GetCartItemsDetailsGqlResponse>({
    access: "user",
    authToken,
    query: GetCartItemsDetailsGql,
  })

  const nodes = request.cart.contents.nodes

  if (nodes.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Your cart is empty.",
    })
  }

  return nodes
}

export async function addCartItemToDb(props: {
  authToken: string
  item: CartItemRecord
}) {
  const productId = +base64.parse<string>({
    base64Id: props.item.id,
    index: 1,
  })

  const { authToken } = props

  const product = await getProductStockDetails(productId)

  const { stockStatus, stockQuantity } = product

  if (stockStatus === "OUT_OF_STOCK" || stockQuantity === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  const data = await client<AddToCartGqlResponse, AddToCartGqlInput>({
    access: "user",
    query: AddToCartGql,
    inputs: {
      productId,
      quantity: props.item.quantity,
    },
    authToken,
  }).catch(() => {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Sorry, Only ${stockQuantity} items left in stock!`,
    })
  })

  if (data.addToCart && data.addToCart.cartItem.quantity > 10) {
    await updateCartItemToDb({
      authToken,
      item: {
        id: data.addToCart.cartItem.key,
        quantity: 10,
      },
    })

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Requested quantity exceeds the available stock.",
    })
  }
}

export async function updateCartItemToDb(props: {
  authToken: string
  item: CartItemRecord
}) {
  const nodes = await getCartFromDb(props.authToken)

  const existing = nodes.find((a) => a.key === props.item.id)

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "The item does not exist in your cart.",
    })
  }

  const product = existing.product.node

  if (product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  if (props.item.quantity > (product.stockQuantity ?? 0)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Sorry, Only ${product.stockQuantity} items left in stock.`,
    })
  }

  await client<
    UpdateCartItemQuantityGqlResponse,
    UpdateCartItemQuantityGqlInput
  >({
    access: "user",
    inputs: {
      items: [
        {
          key: existing.key,
          quantity: props.item.quantity,
        },
      ],
    },
    query: UpdateCartItemQuantityGql,
    authToken: props.authToken,
  })
}

export async function removeCartItemFromDb(props: {
  authToken: string
  item: CartItemRecord
}) {
  await client<unknown, RemoveCartItemGqlInput>({
    access: "user",
    query: RemoveCartItemGql,
    authToken: props.authToken,
    inputs: {
      keys: [props.item.id],
      all: false,
    },
  })
}

export async function countCartItemsFromDb(authToken: string) {
  const nodes = await getCartFromDb(authToken)

  return nodes.reduce<number>((acc, item) => acc + +item.quantity, 0)
}

export function getStoreFromCookie() {
  const cartCookie = cookies().get("store.cart.items")

  if (!cartCookie) return []

  const cookieCartItems = JSON.parse(cartCookie.value) as CartItemRecord[]

  return cookieCartItems
}

export async function getCartFromCookie() {
  const cookieCartItems = getStoreFromCookie()

  if (cookieCartItems.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Your cart is empty.",
    })
  }

  const includeIds = cookieCartItems.map(
    (a) => +base64.parse<string>({ base64Id: a.id, index: 1 }),
  )

  const request = await client<
    GetProductDetailsForCartItemsGqlResponse,
    GetProductDetailsForCartItemsGqlInput
  >({
    access: "public",
    query: GetProductDetailsForCartItemsGql,
    cacheTags: [],
    inputs: {
      include: includeIds,
    },
  })

  const nodes = request.products.nodes

  if (nodes.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Your cart is empty.",
    })
  }

  return nodes.reduce<
    GetCartItemsDetailsGqlResponse["cart"]["contents"]["nodes"]
  >((acc, item) => {
    const node = cookieCartItems.find((a) => a.id === item.id)

    if (!node) return acc

    acc.push({
      key: item.id as string,
      quantity: node.quantity,
      product: {
        node: item,
      },
    })

    return acc
  }, [])
}

export function setCartItemsToCookie(items: CartItemRecord[]) {
  cookies().set({
    name: "store.cart.items",
    value: JSON.stringify(items),
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: true,
    sameSite: "strict",
    httpOnly: true,
  })
}

export async function addCartItemToCookie(item: CartItemRecord) {
  const productId = +base64.parse<string>({
    base64Id: item.id,
    index: 1,
  })

  const cookieCartItems = getStoreFromCookie()

  const product = await getProductStockDetails(productId)

  const { stockStatus, stockQuantity } = product

  if (stockStatus === "OUT_OF_STOCK" || stockQuantity === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  const existing = cookieCartItems.find((cartItem) => cartItem.id === item.id)

  if (existing) {
    if (existing.quantity >= (stockQuantity ?? 0)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Sorry, Only ${stockQuantity} items left in stock!`,
      })
    }

    const updatedCartItemRecords = cookieCartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        }
      }

      return cartItem
    })

    return setCartItemsToCookie(updatedCartItemRecords)
  }

  const updatedCartItemRecords = [
    ...cookieCartItems,
    ...[{ ...item, quantity: item.quantity }],
  ]

  return setCartItemsToCookie(updatedCartItemRecords)
}

export async function updateCartItemToCookie(item: CartItemRecord) {
  const productId = +base64.parse<string>({
    base64Id: item.id,
    index: 1,
  })

  const nodes = getStoreFromCookie()

  const existing = nodes.find((a) => a.id === item.id)

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This item does not exist in your cart.",
    })
  }

  const product = await getProductStockDetails(productId)

  if (product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  if (item.quantity > (product.stockQuantity ?? 0)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Sorry, Only ${product.stockQuantity} items left in stock.`,
    })
  }

  const updatedCartItemRecords = nodes.map((a) => {
    if (a.id === item.id) {
      return {
        ...a,
        quantity: item.quantity,
      }
    }

    return a
  })

  setCartItemsToCookie(updatedCartItemRecords)
}

export function removeCartItemFromCookie(item: CartItemRecord) {
  const nodes = getStoreFromCookie()

  const existing = nodes.find((a) => a.id === item.id)

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This item does not exist in your cart.",
    })
  }

  const updatedCartItemRecords = nodes.filter((a) => a.id !== item.id)

  setCartItemsToCookie(updatedCartItemRecords)
}

export function countCartItemFromCookie() {
  const nodes = getStoreFromCookie()

  if (nodes.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Your cart is empty.",
    })
  }

  return nodes.reduce<number>((acc, item) => acc + item.quantity, 0)
}

export function sortCartItemsData(props: {
  cartItems: CartItemData
  postcode: string | null
}) {
  return props.cartItems.map((a) => {
    const product = a.product.node
    const productId = +base64.parse<string>({
      base64Id: product.id as string,
      index: 1,
    })

    const quantityOptions = Array(
      Math.min(
        (product.stockQuantity ?? 0) > 0 ? product.stockQuantity ?? 0 : 0,
        10,
      ),
    )
      .fill(" ")
      .map((_, i) => ({
        id: (i + 1).toString(),
        name: i + 1,
        value: i + 1,
        isActive: i + 1 === +a.quantity,
      }))

    const checkErrors = (): ExtendCartItem["error"] => {
      if (
        product.stockStatus === "OUT_OF_STOCK" ||
        product.stockQuantity === 0
      ) {
        return {
          errorEnum: "stock",
          message:
            "The item is currently out of stock. Please remove the item.",
        }
      }

      if (!!!quantityOptions.find((option) => option.isActive)) {
        return {
          errorEnum: "quantity",
          message:
            "Please select a quantity lower or equal to the available stock.",
        }
      }

      if (!product.productSettings.allowedShippingPincodes) return null

      const AllowedPostcodes =
        product.productSettings.allowedShippingPincodes.split("\r\n")

      // Todo check allowed shipping states

      if (!props.postcode) return null

      if (!AllowedPostcodes.includes(props.postcode)) {
        return {
          errorEnum: "shipping",
          message: `Shipping on ${props.postcode} only for this item is not available at this moment. Please change the address or remove the item.`,
        }
      }

      return null
    }

    const tax = calculateGst(
      +(product.price ?? 0) * +a.quantity,
      product.taxClass,
    )

    const error = checkErrors()

    const hasSelectedQuantity =
      !!quantityOptions.find((option) => option.isActive) ||
      product.stockStatus === "OUT_OF_STOCK"

    return {
      id: productId,
      tax: tax,
      key: a.key,
      error: error,
      type: product.type,
      name: product.name,
      quantity: a.quantity,
      image: product.image,
      price: product.price,
      regularPrice: product.regularPrice,
      stockQuantity: product.stockQuantity,
      stockStatus: product.stockStatus,
      quantityOptions: quantityOptions,
      hasSelectedQuantity: hasSelectedQuantity,
      hasCashOnDelivery: product.productSettings.hasCashOnDelivery,
    } satisfies MainCartItem
  })
}

import "server-only"

import { client } from "~/lib/graphql/client"
import {
  GetAllProductsStockDetailsGql,
  GetProductStockDetailsGql,
  type GetProductStockDetailsGqlResponse,
  type GetAllProductsStockDetailsGqlResponse,
  type GetProductStockDetailsGqlInput,
} from "./cart-gql"
import { TRPCError } from "@trpc/server"
import { base64 } from "~/lib/utils/functions/base64"
import type { CartItemData, CartItemRecord, ExtendCartItem, MainCartItem } from "./cart-types"
import { cookies } from "next/headers"
import { calculateGst } from "~/lib/utils/functions/calculate-gst"
import { response } from "~/vertex/lib/action"
import { getCachedProductStock } from "../redis/redis-actions"

export async function getCartItemData() {
  const cookieCartItems = getCookieStore()

  if (cookieCartItems.length === 0) return []

  const responses = await Promise.all(cookieCartItems.map((a) => getCachedProductStock({ productId: a.id })))

  return responses.reduce<CartItemData>((acc, item) => {
    const existing = cookieCartItems.find((a) => a.id === item.data?.id)

    if (!existing || !item.data) return acc

    acc.push({
      key: item.data.id as string,
      quantity: existing.quantity,
      product: {
        node: {
          id: item.data.id as string,
          type: item.data.type,
          image: item.data.image,
          name: item.data.name,
          price: item.data.price,
          regularPrice: item.data.regularPrice,
          stockQuantity: item.data.stockQuantity,
          stockStatus: item.data.stockStatus,
          taxClass: item.data.taxClass,
          taxStatus: item.data.taxStatus,
          productSettings: item.data.productSettings,
        },
      },
    })

    return acc
  }, [])
}

export async function addCartItemToCookie(item: CartItemRecord) {
  const cookieCartItems = getCookieStore()

  const product = await getCachedProductStock({ productId: item.id })

  if (!product.data) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Product not found",
    })
  }

  const { stockStatus, stockQuantity } = product.data

  if (stockStatus === "OUT_OF_STOCK" || stockQuantity === 0) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  const existing = cookieCartItems.find((cartItem) => cartItem.id === item.id)

  if (existing) {
    if (existing.quantity >= (stockQuantity ?? 0)) {
      throw new ExtendedError({
        code: "NOT_FOUND",
        message: `Sorry, Only ${stockQuantity} items left in stock!`,
      })

      // throw new TRPCError({
      //   code: "BAD_REQUEST",
      //   message: `Sorry, Only ${stockQuantity} items left in stock!`,
      // })
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

    setCartItemsToCookie(updatedCartItemRecords)

    return response.success({
      data: null,
    })
  }

  const updatedCartItemRecords = [...cookieCartItems, ...[{ ...item, quantity: item.quantity }]]

  setCartItemsToCookie(updatedCartItemRecords)

  return response.success({
    data: null,
  })
}

export async function updateCartItemToCookie(item: CartItemRecord) {
  const nodes = getCookieStore()

  const existing = nodes.find((a) => a.id === item.id)

  if (!existing) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This item does not exist in your cart.",
    })
  }

  const product = await getCachedProductStock({ productId: item.id })

  if (!product.data) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Product not found",
    })
  }

  if (product.data.stockStatus === "OUT_OF_STOCK" || product.data.stockQuantity === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is out of stock",
    })
  }

  if (item.quantity > (product.data.stockQuantity ?? 0)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Sorry, Only ${product.data.stockQuantity} items left in stock.`,
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
  const nodes = getCookieStore()

  const existing = nodes.find((a) => a.id === item.id)

  if (!existing) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "This item does not exist in your cart.",
    })
  }

  const updatedCartItemRecords = nodes.filter((a) => a.id !== item.id)

  setCartItemsToCookie(updatedCartItemRecords)

  return updatedCartItemRecords
}

export function countCartItemFromCookie() {
  const nodes = getCookieStore()

  if (nodes.length === 0) return 0

  return nodes.reduce<number>((acc, item) => acc + item.quantity, 0)
}

export function sortCartItemsData(props: { cartItems: CartItemData; postcode: string | null }) {
  return props.cartItems.map((a) => {
    const product = a.product.node
    const productId = +base64.parse<string>({
      base64Id: product.id as string,
      index: 1,
    })

    const quantityOptions = Array(Math.min((product.stockQuantity ?? 0) > 0 ? product.stockQuantity ?? 0 : 0, 10))
      .fill(" ")
      .map((_, i) => ({
        id: (i + 1).toString(),
        name: i + 1,
        value: i + 1,
        isActive: i + 1 === +a.quantity,
      }))

    const checkErrors = (): ExtendCartItem["error"] => {
      if (product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity === 0) {
        return {
          errorEnum: "stock",
          message: "The item is currently out of stock. Please remove the item.",
        }
      }

      if (!!!quantityOptions.find((option) => option.isActive)) {
        return {
          errorEnum: "quantity",
          message: "Please select a quantity lower or equal to the available stock.",
        }
      }

      if (!product.productSettings.allowedShippingPincodes) return null

      const AllowedPostcodes = product.productSettings.allowedShippingPincodes.split("\r\n")

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

    const tax = calculateGst(+(product.price ?? 0) * +a.quantity, product.taxClass)

    const error = checkErrors()

    const hasSelectedQuantity =
      !!quantityOptions.find((option) => option.isActive) || product.stockStatus === "OUT_OF_STOCK"

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

export async function getAllProductsStockDetails() {
  const data = await client<GetAllProductsStockDetailsGqlResponse, unknown>({
    access: "public",
    cacheTags: [],
    query: GetAllProductsStockDetailsGql,
    noCache: true,
  })

  return data.products.nodes
}

export async function getProductStockDetails(id: string) {
  const data = await client<GetProductStockDetailsGqlResponse, GetProductStockDetailsGqlInput>({
    access: "public",
    cacheTags: [],
    query: GetProductStockDetailsGql,
    noCache: true,
    inputs: {
      id,
    },
  })

  return data.product
}

function getCookieStore() {
  const cartCookie = cookies().get("store.cart.items")

  if (!cartCookie) return []

  const cookieCartItems = JSON.parse(cartCookie.value) as CartItemRecord[]

  return cookieCartItems
}

function setCartItemsToCookie(items: CartItemRecord[]) {
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

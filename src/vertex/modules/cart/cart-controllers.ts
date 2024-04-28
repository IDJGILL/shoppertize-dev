import "server-only"

import {
  countCartItemFromCookie,
  getCachedProductStock,
  getCartItemData,
  getCookieStore,
  setCartItemsToCookie,
  sortCartItemsData,
} from "./cart-server-utils"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import { calcSummary } from "./cart-client-utils"
import { revalidatePath } from "next/cache"
import type { CartItem } from "./cart-schemas"
import { publicQuery } from "~/vertex/lib/server/server-query-helper"
import { getCurrentAddress } from "../address/address-server-utils"

export const getCart = publicQuery(async (session) => {
  const [cartItems, address] = await Promise.all([
    getCartItemData(),
    !!session ? getCurrentAddress(session.user.id) : null,
  ])

  const items = sortCartItemsData({
    cartItems,
    postcode: address?.postcode ?? null,
  })

  const cartSummary = calcSummary({ items })

  return {
    items,
    cartSummary,
    address: address ?? null,
    isCartEmpty: cartItems.length === 0,
  }
})

export async function addItemToCart(item: CartItem): Promise<void> {
  const cookieCartItems = getCookieStore()

  const product = await getCachedProductStock(item.id)

  if (!product) {
    throw new ExtendedError({
      code: "NOT_FOUND",
      message: "Product not found",
    })
  }

  const { stockStatus, stockQuantity } = product

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

    return revalidatePath("/cart")
  }

  const updatedCartItemRecords = [...cookieCartItems, ...[{ ...item, quantity: item.quantity }]]

  setCartItemsToCookie(updatedCartItemRecords)

  return revalidatePath("/cart")
}

export const getCartItemsCount = async (): Promise<number> => {
  const count = await new Promise<number>((resolve) => resolve(countCartItemFromCookie()))

  return count
}

import "server-only"

import {
  countCartItemFromCookie,
  getCachedProductStock,
  getCartItemData,
  getCookieStore,
  setCartItemsToCookie,
  sortCartItemsData,
} from "./cart-server-utils"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { calcSummary } from "./cart-client-utils"
import { getCurrentAddressFromSession } from "../address/address-server-utils"
import { partialQuery, protectedQuery } from "~/vertex/lib/trpc/trpc-init"
import { revalidatePath } from "next/cache"
import { getAddressOptions } from "../address/address-queries"
import { headers } from "next/headers"
import type { CartItem } from "./cart-schemas"
import { $Address } from "../address/address-models"
import { z } from "zod"
import { $Null } from "../auth/auth-models"

export const getCart = partialQuery(async (session) => {
  const [cartItems, currentAddress] = await Promise.all([
    getCartItemData(),
    !!session ? getCurrentAddressFromSession(session.user.id) : null,
  ])

  const items = sortCartItemsData({
    cartItems,
    postcode: currentAddress?.address.shipping.postcode ?? null,
  })

  const cartSummary = calcSummary({ items })

  return {
    items,
    cartSummary,
    address: currentAddress ?? null,
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

export const getCurrentAddress = protectedQuery($Null, async (_, session) => {
  return await getCurrentAddressFromSession(session.user.id)
})

export const getAddressById = protectedQuery(z.string().optional(), async (id, session) => {
  const { addresses } = await getAddressOptions(session.authToken)

  const exists = addresses.find((a) => a.id === id)

  if (!exists) return null

  return exists
})

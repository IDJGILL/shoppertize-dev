"use server"

import { publicAction } from "~/vertex/lib/action"
import {
  addCartItemToCookie,
  countCartItemFromCookie,
  getCartItemData,
  removeCartItemFromCookie,
  sortCartItemsData,
  updateCartItemToCookie,
} from "./cart-server-utils"
import { auth } from "~/lib/modules/auth/auth-config"
import { $CartItem } from "./cart-schemas"
import { summary } from "~/lib/modules/cart/cart-methods"
import { getCurrentAddress } from "../address/address-actions"

/**
 * Gets cart data like items, summary and address
 */
export const getCartData = async () => {
  const session = await auth()

  const [cartItems, addressData] = await Promise.all([
    getCartItemData(),
    !!session ? getCurrentAddress(+session.user.id) : null,
  ])

  const items = sortCartItemsData({
    cartItems,
    postcode: addressData?.address.shipping.postcode ?? null,
  })

  const cartSummary = summary.calc({ items })

  return {
    items,
    cartSummary,
    address: addressData?.address ?? null,
    isCartEmpty: cartItems.length === 0,
  }
}

/**
 * Adds product item to the cart
 */
export const addToCart = publicAction($CartItem, async (input, ctx) => {
  await addCartItemToCookie(input)

  return ctx.response.success({
    data: true,
    message: "Added to cart",
  })
})

/**
 * Updates cart item quantity in cart
 */
export const updateQuantity = publicAction($CartItem, async (input, ctx) => {
  await updateCartItemToCookie(input)

  return ctx.response.success({
    data: true,
    message: "Quantity updated",
  })
})

/**
 * Removes product item to the cart
 */
export const removeItem = publicAction($CartItem, async (input, ctx) => {
  await new Promise((resolve) => resolve(removeCartItemFromCookie(input)))

  return ctx.response.success({
    data: true,
    revalidatePaths: ["/cart"],
    revalidateTags: ["cart-items-count"],
  })
})

/**
 * Gets total cart items count
 */
export const getCartItemsCount = async () => {
  const count = await new Promise<number>((resolve) =>
    resolve(countCartItemFromCookie()),
  )

  return count
}

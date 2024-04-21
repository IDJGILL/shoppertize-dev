import type { MainCartItem, SummaryMethods, GetCartOutput } from "./cart-types"
import { address } from "../address/utils/address-methods"
import { trpcPublic } from "~/lib/trpc/trpc-context"
import {
  addCartItemToCookie,
  addCartItemToDb,
  countCartItemFromCookie,
  countCartItemsFromDb,
  getCartFromCookie,
  getCartFromDb,
  removeCartItemFromCookie,
  removeCartItemFromDb,
  sortCartItemsData,
  updateCartItemToCookie,
  updateCartItemToDb,
} from "./cart-server-utils"
import { type CartItemRecordSchemaProps } from "./cart-schemas"

export const get = trpcPublic<unknown, GetCartOutput>(async (props) => {
  const { session } = props.ctx

  const [cartItems, shippingAddress] = await Promise.all([
    !!session ? getCartFromDb(session.authToken) : getCartFromCookie(),

    !!session ? address.get.shipping({ authToken: session.authToken }) : null,
  ])

  const items = sortCartItemsData({
    cartItems,
    postcode: shippingAddress?.postcode ?? null,
  })

  const cartSummary = summary.calc({ items })

  return props.response.success({
    data: {
      items,
      cartSummary,
      shippingAddress,
    },
  })
})

export const add = trpcPublic<CartItemRecordSchemaProps, boolean>(
  async (props) => {
    const { session } = props.ctx

    if (!!!session) {
      await addCartItemToCookie(props.input)

      return props.response.success({
        data: true,
      })
    }

    await addCartItemToDb({
      item: props.input,
      authToken: session.authToken,
    })

    return props.response.success({
      data: true,
    })
  },
)

export const update = trpcPublic<CartItemRecordSchemaProps, boolean>(
  async (props) => {
    const { session } = props.ctx

    if (!!!session) {
      await updateCartItemToCookie(props.input)

      return props.response.success({
        data: true,
      })
    }

    await updateCartItemToDb({
      item: props.input,
      authToken: session.authToken,
    })

    return props.response.success({
      data: true,
    })
  },
)

export const remove = trpcPublic<CartItemRecordSchemaProps, boolean>(
  async (props) => {
    const { session } = props.ctx

    if (!!!session) {
      removeCartItemFromCookie(props.input)

      return props.response.success({
        data: true,
      })
    }

    await removeCartItemFromDb({
      item: props.input,
      authToken: session.authToken,
    })

    return props.response.success({
      data: true,
    })
  },
)

export const count = trpcPublic<unknown, number>(async (props) => {
  const { session } = props.ctx

  if (!!!session) {
    const count = countCartItemFromCookie()

    return props.response.success({
      data: count,
    })
  }

  const count = await countCartItemsFromDb(session.authToken)

  return props.response.success({
    data: count,
  })
})

// Todo - Find some place somewhere for this method
export const summary: SummaryMethods = {
  calc: (props: { items: MainCartItem[] }) => {
    const totalMrp = props.items.reduce(
      (acc, item) => acc + +(item.regularPrice ?? "0") * item.quantity,
      0,
    )

    const totalPrice = props.items.reduce(
      (acc, item) => acc + +(item.price ?? "0") * item.quantity,
      0,
    )

    const cartDiscount = totalMrp - totalPrice

    const subtotal = totalPrice

    const total = subtotal

    return {
      totalMrp,
      cartDiscount,
      subtotal,
      total,
    }
  },
}

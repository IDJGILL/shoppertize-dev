"use client"

import { createContext, useContext } from "react"
import type { getCart } from "~/vertex/modules/cart/cart-controllers"

const CartContext = createContext<CartData | null>(null)

export type CartData = Awaited<ReturnType<typeof getCart>>

export const useCartContext = () => {
  const context = useContext(CartContext)

  if (!context) throw new Error("Please wrap useCart inside CartContext")

  return context
}

interface CartContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  data: CartData
}

export function CartContextProvider({ ...props }: CartContextProviderProps) {
  const {} = props

  return <CartContext.Provider value={props.data}>{props.children}</CartContext.Provider>
}

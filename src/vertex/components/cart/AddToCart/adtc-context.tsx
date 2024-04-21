"use client"

import { createContext, useContext } from "react"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { addToCart } from "~/vertex/modules/cart/cart-actions"

type InitialData = Pick<
  GqlDataProps,
  | "id"
  | "type"
  | "slug"
  | "price"
  | "regularPrice"
  | "stockQuantity"
  | "stockStatus"
  | "lowStockAmount"
  | "manageStock"
>

export const AddToCartContext = createContext<ReturnType<
  typeof useAddToCartLogic
> | null>(null)

const useAddToCartLogic = (data: InitialData) => {
  const action = useActionHandler(addToCart)

  const mutate = () => {
    action.mutate({ id: data.id as string, quantity: 1 })
  }

  return {
    ...action,
    mutate,
  }
}

export const useAddToCart = () => {
  const context = useContext(AddToCartContext)

  if (!context) throw new Error("Please use useAddToCart hook inside AddToCart")

  return context
}

interface AddToCartProps extends React.HTMLAttributes<HTMLElement> {
  initialData: InitialData
}

export function AddToCartContextProvider({ ...props }: AddToCartProps) {
  const { initialData } = props

  return (
    <AddToCartContext.Provider value={useAddToCartLogic(initialData)}>
      {props.children}
    </AddToCartContext.Provider>
  )
}

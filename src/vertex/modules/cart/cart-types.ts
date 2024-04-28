import type { GqlProductSettingsProps, PickDataFields } from "~/vertex/global/global-types"

export type CartItemData = Array<
  PickDataFields<"key" | "quantity"> & {
    product: {
      node: PickDataFields<
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

export type CartItemRecord = {
  id: string // or key
  quantity: number
}

export type MainCartItem = Pick<CartItemData[number], "key" | "quantity"> &
  Pick<
    CartItemData[number]["product"]["node"],
    "type" | "name" | "image" | "price" | "regularPrice" | "stockQuantity" | "stockStatus"
  > &
  ExtendCartItem

export type ExtendCartItem = {
  id: number
  quantityOptions: QuantityOptions[]
  hasSelectedQuantity: boolean
  hasCashOnDelivery: boolean
  tax: number
  error?: {
    errorEnum: "shipping" | "quantity" | "stock"
    message: string
  } | null
}

type QuantityOptions = {
  id: string
  name: number
  value: number
  isActive: boolean
}

export type SummaryMethods = {
  calc: (props: { items: MainCartItem[] }) => Summary
}

export type Summary = {
  totalMrp: number
  cartDiscount: number
  subtotal: number
  total: number
  cod?: number
  wallet?: number
  coupon?: number
}

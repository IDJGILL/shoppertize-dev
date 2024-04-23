import type { SortedCoupon } from "../coupon/utils/coupon-types"
import { type WalletActionSchemaProps } from "~/lib/server/api/store/wallet/wallet.dtos"
import type { Address } from "../order/utils/order-types"
import { type Session } from "next-auth"
import type { MainCartItem } from "../cart/cart-types"
import type { PaymentMethod } from "../payment/payment-types"

export type CheckoutMethods = {
  get: (props: { session: Session }) => Promise<{
    cartTotals: {
      totalMrp: number
      cartDiscount: number
      subtotal: number
      total: number
      charges: Record<never, number>[]
      additions: Record<never, number>[]
    }
    paymentOptions: {
      type: string
      label: string
      description: string
      isEligible: boolean
    }[]
    shippingAddress: Pick<
      GqlDataProps,
      "firstName" | "lastName" | "email" | "phone" | "postcode" | "city" | "state" | "country" | "address1" | "address2"
    >
    walletBalance: number
  }>
  validate: (props: { items: MainCartItem[]; paymentMethod?: PaymentMethod }) => void
  session: {
    set: (props: { userId: string; payload: Partial<CheckoutSession> }) => Promise<void>
    get: (props: { userId: string }) => Promise<CheckoutSession>
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export type SessionQueryData = {
  customer: {
    shipping: Address
    metaData: MetaData[]
    session: MetaData[]
  }
  cart: {
    contents: {
      nodes: CartSessionItem[]
    }
  }
}

export type SessionCartRecordItem = {
  key: string
  product_id: number
  variation_id: number
  variation: {
    attribute_pa_color: string
    attribute_pa_size: string
  }
  quantity: number
  line_subtotal: number
  line_total: number
}

export type CartLineItem = {
  product_id: number
  quantity: number
  variation_id?: number
}

export type SessionCartTotals = {
  subtotal: string
  shipping_total: string
  discount_total: number
  cart_contents_total: string
  total: string
  subtotal_tax: number
  total_tax: number
}

export type CheckoutStatus = "CART_ERROR" | "OTHER_ERROR" | "SUCCESS" | "PAY_PAGE"

export type CheckoutGuardProps = {
  cart: CartLineItem[]
  cartContents: CartSessionItem[]
  pincode: string
}

export type CheckoutData = {
  cartContents: CartSessionItem[]
  summary: OnlineSummary
  coupons: SortedCoupon[]
  shippingAddress: Address
  walletBalance: number
  isWalletApplied: boolean
  cartTotals: SessionCartTotals
}

export type CheckoutContextProps = {
  isLoading: boolean
  applyOrRemove: (action: WalletActionSchemaProps["action"]) => void
  handleMethodChange: (method: PaymentMethod | null) => void
  session: CheckoutData
  method: PaymentMethod | null
  isCodAvailable: boolean
  methodLabel: (method: PaymentMethod | null) => string
  placeOrder: () => void
}

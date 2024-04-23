import type { CartItemData } from "../cart/cart-types"
import type { PaymentMethod } from "../payment/payment-types"

export type CheckoutSession = {
  checkoutOutAt: string
  referenceId: string
  paymentMethod: PaymentMethod
  items: CartItemData
}

export type OrderProps = {
  customer_id: number
  status:
    | "processing"
    | "readytodispatch"
    | "dispatched"
    | "intransit"
    | "delivered"
    | "cancelled"
    | "refunded"
    | "failed"
    | "completed"
  payment_method: "cod" | "online"
  set_paid: boolean
  billing: OrderBillingProps
  shipping: OrderShippingProps
  line_items: LineItem[]
  fee_lines: FeeLine[]
  meta_data: MetaData[]
}

export type OrderShippingProps = {
  first_name: string
  last_name: string
  phone: string
  postcode: string
  city: string
  state: string
  country: string
  address_1: string
  address_2: string
}

export type OrderBillingProps = {
  first_name: string
  last_name: string
  email: string
  phone: string
  postcode: string
  city: string
  state: string
  country: string
  address_1: string
  address_2: string
  company: string
}

export type FeeLine = {
  name: string
  total: string
  tax_status: "taxable" | "none"
}

export type LineItem = {
  product_id: number
  quantity: number
}

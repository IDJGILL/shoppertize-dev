import type { CartLineItem, SessionCartTotals } from "../../checkout/checkout-types"
import type { NimbusTrackingHistory } from "../../courier/courier-types"

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

export type PlaceOrderAction = "success" | "error" | "pay_page"

export type PriceCalculatorProps = {
  paymentMethod: PaymentMethod
  cartTotals: SessionCartTotals
  shippingCharges: number
  isWalletApplied: boolean
  email: string
  walletBalance: number
  appliedCoupon: CouponTodo | null
}

export type CalculatePaymentMethod = {
  requestedMethod: PaymentMethod
  walletBalance: number
  isWalletApplied: boolean
  total: number
}

export type GetDataForOrder = {
  requestedMethod: PaymentMethod
  authToken: string
}

export type UpdatePostOrderMetaInput = {
  metaData: MetaData[]
  sessionData: MetaData[]
  authToken: string
}

export type CreateOrderInput = {
  cart: CartLineItem[]
  customerId: string
  paymentMethod: PaymentMethod
  billing: Partial<Address>
  shipping: Address
  transactionReferenceId: string
  email: string
  cartTotals: SessionCartTotals
  shippingCharges: number
  isWalletApplied: boolean
  walletBalance: number
  appliedCoupon: CouponTodo | null
  metaData: MetaData[]
  sessionData: MetaData[]
  authToken: string
  productSlugs: string[]
}

export type InfiniteOrder = {
  id: string
  status: OrderStatus
  date: string
  lineItems: {
    nodes: InfiniteOrderLineItem[]
  }
  metaData: MetaData[]
  tracking?: Tracking
}

export type InfiniteOrderLineItem = {
  orderId: number
  productId: number
  quantity: number
  subtotalTax: number
  product: {
    node: {
      id: string
      type: ProductType
      name: string
      image: ProductImage
    }
  }
}

export type Tracking = {
  created: string
  edd: string
  delivered_date: string
  shipped_date: string
  awb_number: string
  status: string
  history: NimbusTrackingHistory[]
}

export type SingleOrder = {
  id: string
  status: OrderStatus
  date: string
  datePaid: string | null
  dateCompleted: string | null
  discountTotal: string
  shippingTotal: string
  shipping: Address
  billing: Address | undefined
  feeLines: {
    nodes: FeeLine[]
  }
  subtotal: string
  total: string
  metaData: MetaData[]
  lineItems: {
    nodes: SingleOrderLineItem[]
  }
  tracking?: Tracking
}

export type Address = {
  firstName: NullableType<string>
  lastName: NullableType<string>
  postcode: NullableType<string>
  phone: NullableType<string>
  address1: NullableType<string>
  address2: NullableType<string>
  city: NullableType<string>
  state: NullableType<string>
  country: NullableType<string>
  company: NullableType<string>
  email: NullableType<string>
}

export type SingleOrderLineItem = {
  orderId: number
  productId: number
  quantity: number
  subtotalTax: number
  total: string
  product: {
    node: {
      id: string
      type: ProductType
      name: string
      image: ProductImage
    }
  }
}

export type OrderStatus =
  | "CANCELLED"
  | "DELIVERED"
  | "FAILED"
  | "INTRANSIT"
  | "PROCESSING"
  | "READYTODISPATCH"
  | "REFUNDED"
  | "PACKED"

export type ConfirmationResponse =
  | {
      status: "PAYMENT_ERROR" | "PAYMENT_PENDING" | "PAYMENT_DECLINED"
      orderId: null
    }
  | { status: "PAYMENT_SUCCESS"; orderId: string }

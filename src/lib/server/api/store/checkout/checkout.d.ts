type ApiStatus<TStatus, TData> = {
  success: boolean
} & (
  | { success: false; status: TStatus; message: string; data: null }
  | {
      success: true
      status: TStatus
      message: string
      data: TData
    }
)

type PlaceOrderInputProps = {
  refreshToken: string
  customerMeta: MetaData[]
  orderMeta: MetaData[]
  method: "cod" | "other_payment"
  transactionId: string
  billing: Address
}

type UsedCoupon = {
  code: string
  discountAmount: number
  date: string
}

type ShippingLine = {
  method_id: string
  method_title: string
  total: string
}

type CouponLine = {
  code: string
}

type SelectedShippingMethod = {
  methodId: string
  isFree: boolean
}

type CheckoutProduct = SimpleCheckoutProduct

type CartSessionItem = Omit<SimpleCheckoutProduct, "type">

type SimpleCheckoutProduct = {
  type: "SIMPLE"
  key: string
  quantity: number
  product: {
    node: {
      id: string
      name: string
      regularPrice: string
      salePrice: string
      stockStatus: StockStatus
      stockQuantity: number
      image: ProductImage
      productSettings: {
        hasCashOnDelivery: true | null
        hasReturnExchange: true | null
        allowedShippingPincodes: string | null
        allowedShippingStates: string | null
      }
      productCategories: {
        nodes: {
          slug: string
        }[]
      }
    }
  }
  variation: null
}

type ShippingMethod = {
  packageDetails: string
  supportsShippingCalculator: boolean
  rates:
    | {
        cost: string
        id: string
        instanceId: string
        label: string
        methodId: string
      }[]
    | null
}

type MetaKey =
  | "wallet_balance"
  | "wallet_transactions"
  | "used_coupons"
  | "cart"
  | "cart_totals"
  | "applied_coupons"
  | "coupon_discount_totals"
  | "chosen_shipping_methods"
  | "applied_wallet"
  | "session_token"
  | "review_record"
  | "profile"
  | "tokens"

type CreateOrderInputProps = {
  method: PaymentMethod
  refreshToken: string
  transactionId: string
  transactionReferenceId: string
}

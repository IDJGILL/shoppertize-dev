import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import type { MainCartItem } from "../cart/cart-types"
import type { PaymentMethod } from "../payment/payment-types"

export function validateCartItems(props: { items: MainCartItem[]; paymentMethod?: PaymentMethod }) {
  const isCartEmpty = props.items.length === 0

  if (isCartEmpty) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "Cart is empty.",
    })
  }

  const hasErrors = props.items.some((a) => !!a.error?.errorEnum)

  if (hasErrors) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "Cart Contains Items with Issues: Please resolve them before you proceed.",
    })
  }

  const hasNoCodDeliveryItems = props.items.some((a) => !a.hasCashOnDelivery)

  if (props.paymentMethod === "COD" && hasNoCodDeliveryItems) {
    throw new ExtendedError({
      code: "UNAUTHORIZED",
      message: "Unable to Use Cash on Delivery: Some items in your cart are not eligible for Cash on Delivery.",
    })
  }
}

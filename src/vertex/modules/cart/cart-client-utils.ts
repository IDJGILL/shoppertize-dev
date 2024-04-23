import type { MainCartItem } from "./cart-types"

export const calcSummary = (props: { items: MainCartItem[] }) => {
  const totalMrp = props.items.reduce((acc, item) => acc + +(item.regularPrice ?? "0") * item.quantity, 0)

  const totalPrice = props.items.reduce((acc, item) => acc + +(item.price ?? "0") * item.quantity, 0)

  const cartDiscount = totalMrp - totalPrice

  const subtotal = totalPrice

  const total = subtotal

  return {
    totalMrp,
    cartDiscount,
    subtotal,
    total,
  }
}

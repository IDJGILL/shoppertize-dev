import React from "react"
import CheckoutWrapper from "../checkout/_components/checkout-wrapper"
import { CartItems } from "./_components/cart-items"
import CartSummary from "./_components/cart-summary"
import PaymentButton from "./_components/payment-button"
import { CartContext } from "~/vertex/components/cart/cart"
import EmptyCartWrapper from "./_components/cart-empty-screen"
import CartAddress from "./_components/cart-address"

export default function CartPage() {
  return (
    <CartContext
      loader={<div>Loading...</div>}
      error={<div>Something went wrong</div>}
    >
      <EmptyCartWrapper>
        <CheckoutWrapper
          left={
            <>
              <CartAddress />

              <CartItems />
            </>
          }
          right={
            <div className="space-y-4">
              <CartSummary />
              <PaymentButton />
            </div>
          }
        />
      </EmptyCartWrapper>
    </CartContext>
  )
}

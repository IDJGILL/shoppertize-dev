"use client"

import FixedBar from "~/app/_components/fixed-bar"
import TrustBadges from "~/app/_components/trust-badge"
// import { Button } from "~/app/_components/ui/button"
// import { useCartContext } from "~/vertex/components/cart/cart/context"

interface PaymentButtonProps extends React.HTMLAttributes<HTMLElement> {}

export default function PaymentButton({ ...props }: PaymentButtonProps) {
  const {} = props

  return (
    <>
      <TrustBadges className="pb-10 md:pb-0" />

      <FixedBar className="p-4 md:relative md:rounded-2xl md:bg-none md:p-0 md:shadow-none">
        {/* <Button className="w-full" onClick={() => proceedToCheckoutHandler()}>
          {isShippingError ? "Change Address" : "Proceed to Checkout"}
        </Button> */}
      </FixedBar>
    </>
  )
}

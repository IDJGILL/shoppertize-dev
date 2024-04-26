"use client"

import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { highlightSection } from "~/lib/utils/functions/highlight-section"
import FixedBar from "~/app/_components/fixed-bar"
import { useCheckoutContext } from "~/lib/modules/checkout/checkout-context"

interface CheckoutFooterProps extends React.HTMLAttributes<HTMLElement> {}

export default function CheckoutFooter({ ...props }: CheckoutFooterProps) {
  const {} = props
  const { placeOrderHandler, paymentMethod } = useCheckoutContext()

  function SelectedMethod() {
    return paymentMethod === "COD"
      ? "Cash on delivery"
      : paymentMethod === "ONLINE"
        ? "Online payment"
        : paymentMethod === "WALLET"
          ? "Wallet"
          : "Payment method"
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Button
          className="w-full"
          // isLoading={isLoading}
          onClick={() => placeOrderHandler()}
        >
          {/* {methodLabel(method)} */}
          Place order
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Mobile */}
      <FixedBar className="md:hidden">
        <div className="grid grid-cols-3 items-center px-4 py-4">
          <div
            className="cursor-pointer"
            onClick={() => {
              highlightSection("payment-methods")
            }}
          >
            <div className="mb-1 flex items-center text-xs font-medium text-primary">
              {paymentMethod === null ? "Choose" : <div className="flex items-center">Selected</div>}{" "}
              <ChevronRight className="h-4 w-4" />
            </div>

            <span className="block text-xs font-medium text-muted-foreground">
              <SelectedMethod />
            </span>
          </div>

          <div className="col-span-2">
            <Button
              className="w-full"
              // isLoading={isLoading}
              onClick={() => placeOrderHandler()}
            >
              Place order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </FixedBar>
    </>
  )
}

"use client"

import { CoinsIcon, ShoppingCart } from "lucide-react"
import Box from "~/app/_components/box"
import { currency } from "~/constants"
import { cn } from "~/lib/utils/functions/ui"
import { useCartContext } from "~/vertex/components/cart/cart-context"

interface CartSummaryProps extends React.HTMLAttributes<HTMLElement> {}

export default function CartSummary({ ...props }: CartSummaryProps) {
  const {} = props

  const { cartSummary } = useCartContext()

  return (
    <Box id="summary-section" className={cn("scroll-m-20 text-sm", props.className)}>
      <div className="pb-1">
        <div className="flex items-center justify-between ">
          <div>Total MRP (Incl. of taxes) </div>
          <div>
            {currency}
            {cartSummary.totalMrp}
          </div>
        </div>

        <div className="mb-2 text-left text-xs text-muted-foreground">Based on all item{`'`}s total M.R.P price.</div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-3" /> Cart Discount
        </div>
        <div>
          - {currency}
          {cartSummary.cartDiscount}
        </div>
      </div>

      {/* <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-3" /> Delivery Fee
        </div>
        <div>
          {cartSummary <= 0
            ? "FREE"
            : currency + cartSummary.deliveryFee}
        </div>
      </div> */}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CoinsIcon className="w-3" /> Subtotal
        </div>
        <div>
          {currency}
          {cartSummary.subtotal}
        </div>
      </div>

      <div className="mb-4 h-2 border-b border-dashed border-slate-300 py-2"></div>

      <div className="mb-1 flex items-center justify-between text-sm ">
        <div className="flex items-center gap-2">Total</div>

        <div>
          {currency}
          {cartSummary.total}
        </div>
      </div>
    </Box>
  )
}

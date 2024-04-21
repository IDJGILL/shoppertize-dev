"use client"

import { Home, ShoppingCart, Truck, Wallet } from "lucide-react"
import Box from "~/app/_components/box"
import { currency } from "~/constants"
import { useCheckoutContext } from "~/lib/modules/checkout/checkout-context"
import { cn } from "~/lib/utils/functions/ui"

interface SummarySectionProps extends React.HTMLAttributes<HTMLElement> {}

export default function SummarySection({ ...props }: SummarySectionProps) {
  const {
    data: { cartTotals },
  } = useCheckoutContext()

  return (
    <Box
      id="summary-section"
      className={cn("scroll-m-20 text-sm font-medium", props.className)}
    >
      <div className="pb-1">
        <div className="flex items-center justify-between ">
          <div>Total MRP (Incl. of taxes) </div>
          <div>
            {currency}
            {cartTotals.totalMrp}
          </div>
        </div>

        <div className="mb-2 text-left text-xs text-muted-foreground">
          Based on all item{`'`}s total M.R.P price.
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-3" /> Cart Discount
        </div>

        <div>
          - {currency}
          {cartTotals.cartDiscount}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-3" /> Delivery charges
        </div>

        <div>
          <span className="text-primary">Free</span>
        </div>
      </div>

      {cartTotals.cod ? (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Home className="w-3" /> Cod charges
          </div>

          <div>
            + {currency}
            {cartTotals.cod}
          </div>
        </div>
      ) : null}

      <div className="mb-4 h-2 border-b border-dashed border-slate-300 py-2"></div>

      {cartTotals.wallet ? (
        <div className="flex items-center justify-between pb-2 text-xs text-primary">
          <div className="flex items-center gap-2">
            <Wallet className="w-3" /> Wallet
          </div>

          <div>
            - {currency}
            {cartTotals.wallet}
          </div>
        </div>
      ) : null}

      {/* {summary.coupon ? (
        <div className="flex items-center justify-between pb-2 text-xs text-primary">
          <div className="flex items-center gap-2">
            <BadgePercent className="w-3" /> Coupon -{" "}
            {summary.coupon.couponCode.toUpperCase()}
          </div>
          <div>
            - {currency}
            {formatPrice({ price: summary.coupon.couponDiscount.toString() })}
          </div>
        </div>
      ) : null} */}

      <div className="mb-1 flex items-center justify-between text-sm ">
        <div className="flex items-center gap-2">Net Payable</div>

        <div>
          {currency}
          {cartTotals.total}
        </div>
      </div>
    </Box>
  )
}

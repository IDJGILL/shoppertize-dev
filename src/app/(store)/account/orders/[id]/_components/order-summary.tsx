import Box from "~/app/_components/box"
import { currency } from "~/constants"
import { type SingleOrder } from "~/lib/modules/order/utils/order-types"
import { formatPrice } from "~/lib/utils/functions/format-price"
import { cn } from "~/lib/utils/functions/ui"

interface OrderSummaryProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function OrderSummary({ ...props }: OrderSummaryProps) {
  const { order } = props

  const itemsTotal = order.lineItems.nodes.reduce(
    (acc, item) => acc + (+item.total + +item.subtotalTax),
    0,
  )

  const orderTotal = order.feeLines.nodes.reduce(
    (acc, item) => acc + +item.total,
    itemsTotal,
  )

  return (
    <Box title="Order Summary" className={cn(props.className)}>
      <div className="flex flex-col gap-4 font-medium">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">Items Total</div>

          <div>
            {currency}
            {(+(+itemsTotal).toFixed(2)).toLocaleString()}
          </div>
        </div>

        {order.feeLines.nodes
          .sort((a, b) => (+a.total < +b.total ? 1 : -1))
          .map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">{item.name}</div>

              <div>
                {+item.total < 0 ? `-${currency}` : currency}
                {Math.abs(+item.total)}
              </div>
            </div>
          ))}

        {+order.discountTotal !== 0 ? (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">Coupon Discount</div>

            <div>
              -{currency}
              {order.discountTotal}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mb-4 h-2 border-b border-dashed border-slate-300 py-2"></div>

      <div className="mb-1 flex items-center justify-between text-sm ">
        <div className="flex items-center gap-2">Order Total</div>

        <div>
          {currency}
          {formatPrice({ price: orderTotal.toString(), decimals: 2 })}
        </div>
      </div>
    </Box>
  )
}

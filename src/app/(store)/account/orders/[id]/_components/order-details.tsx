import Box from "~/app/_components/box"
import { type SingleOrder } from "~/lib/modules/order/utils/order-types"
import { base64 } from "~/lib/utils/functions/base64"
import { formatDate } from "~/lib/utils/functions/format-date"

interface OrderDetailsProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function OrderDetails({ ...props }: OrderDetailsProps) {
  const { order } = props

  return (
    <Box title="Order Details">
      <ul className="text-sm">
        <li className="flex items-center justify-between border-b border-dashed border-slate-100 py-4">
          <span className="font-medium md:text-sm">Order ID:</span>
          <span className="text-muted-foreground">
            #{" "}
            {base64.safeParse({
              base64Id: order.id,
              index: 1,
            })}
          </span>
        </li>

        <li className="flex items-center justify-between border-b border-dashed border-slate-100 py-4">
          <span className="font-medium md:text-sm">Ordered Date</span>
          <span className="text-muted-foreground">
            {formatDate({ date: order.date })}
          </span>
        </li>
      </ul>
    </Box>
  )
}

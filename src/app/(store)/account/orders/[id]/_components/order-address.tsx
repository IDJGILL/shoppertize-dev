import Box from "~/app/_components/box"
import type { SingleOrder } from "~/lib/modules/order/utils/order-types"

interface OrderAddressProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function OrderAddress({ ...props }: OrderAddressProps) {
  const { order } = props

  const address = order.shipping

  // const company = order.billing

  return (
    <>
      <Box title="Delivery Address">
        <div className="flex gap-4 text-sm">
          <div className="w-[95%] text-left font-medium">
            <div className="mb-1 ">
              {address.firstName} {address.lastName}
            </div>

            <div className="line-clamp-1 text-xs text-muted-foreground">
              {address.address1}, {address.address2}
            </div>

            <div className="mb-2 text-muted-foreground">{address.phone}</div>
          </div>
        </div>
      </Box>

      {/* <Box title="Company Details">
        <div className="flex gap-4 text-sm">
          <div className="w-[95%] text-left font-medium">
            <div className="mb-1 ">{address.firstName}</div>

            <div className="line-clamp-1 text-xs text-muted-foreground">
              {address.address1}, {address.address2}
            </div>

            <div className="mb-2 text-muted-foreground">{address.phone}</div>
          </div>
        </div>
      </Box> */}
    </>
  )
}

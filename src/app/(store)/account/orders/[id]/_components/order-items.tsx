import Image from "next/image"
import Box from "~/app/_components/box"
import type { SingleOrder } from "~/lib/modules/order/utils/order-types"

interface OrderItemsProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function OrderItems({ ...props }: OrderItemsProps) {
  const { order } = props

  return (
    <Box title="Order Items" className="">
      {order.lineItems.nodes.map((lineItem, i) => (
        <div className="flex gap-6 border-b py-4 last:border-none" key={i}>
          <div className="aspect-square">
            <Image
              src={lineItem.product.node.image.sourceUrl}
              alt=""
              width={50}
              height={50}
            />
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <div className="mb-3 line-clamp-2 max-w-md text-sm md:text-sm">
                {lineItem.product.node.name}
              </div>

              <span className="mr-2 text-sm text-muted-foreground">
                <span className="text-xs">x</span>
                {lineItem.quantity}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Box>
  )
}

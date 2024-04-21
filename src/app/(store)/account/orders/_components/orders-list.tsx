import Image from "next/image"
import Link from "next/link"
import ErrorFallBack from "~/app/_components/error-fallback"
import { decodeBase64Id } from "~/lib/utils/functions/decodeBase64Id"
import { Button } from "~/app/_components/ui/button"
import Box from "~/app/_components/box"
import type {
  OrderStatus,
  InfiniteOrder,
  Tracking,
} from "~/lib/modules/order/utils/order-types"

interface OrdersListProps extends React.HTMLAttributes<HTMLElement> {
  orders: InfiniteOrder[]
}

export default function OrdersList({ ...props }: OrdersListProps) {
  const { orders } = props

  const hasOrders = orders.length > 0

  return hasOrders ? (
    <div className="flex flex-col space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  ) : (
    <ErrorFallBack
      options={{
        title: "No orders yet",
        sub: "Looks like haven't placed any order yet, start shopping now.",
        buttonLabel: "Start shopping",
        buttonLink: "/",
      }}
      className="h-[400px]"
    />
  )
}

interface OrderCardProps extends React.HTMLAttributes<HTMLElement> {
  order: InfiniteOrder
}

function OrderCard({ ...props }: OrderCardProps) {
  const { order } = props

  return (
    <Link href={`/account/orders/${order.id}`}>
      <Box title={`Order# ${decodeBase64Id(order.id)}`} className="">
        {order.lineItems.nodes.map((lineItem) => (
          <div
            key={lineItem.orderId}
            className="mt-4 flex gap-4 border-b border-dashed last:border-none"
          >
            <div className="aspect-square">
              <Image
                src={lineItem.product.node.image.sourceUrl}
                alt=""
                width={100}
                height={100}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="mb-8">
                <div className="mb-4">
                  <div className="line-clamp-2 text-xs font-medium md:text-sm">
                    {lineItem.product.node.name}
                  </div>
                </div>

                <div className="max-w-max rounded-md bg-slate-100 p-1 px-4 text-xs font-medium">
                  {createStatus(order.status, order.tracking).label}
                </div>
              </div>

              {/* <AddProductReviewModal order={order.lineItems.nodes} open={open} onOpenChange={openSet} /> */}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="max-w-max self-end"
              >
                Track Order
              </Button>
            </div>
          </div>
        ))}
      </Box>
    </Link>
  )
}

export const createStatus = (orderStatus: OrderStatus, tracking?: Tracking) => {
  if (orderStatus === "CANCELLED") return { label: "Canceled", progress: 100 }

  if (orderStatus === "FAILED") return { label: "Failed", progress: 100 }

  if (orderStatus === "PROCESSING") return { label: "Ordered", progress: 0 }

  if (orderStatus === "DELIVERED") return { label: "Delivered", progress: 0 }

  if (tracking?.history[0]?.status_code === "IT") {
    return { label: "In Transit", progress: 0 }
  }

  if (tracking?.history[0]?.status_code === "EX")
    return { label: "Delay", progress: 0 }

  if (tracking?.history[0]?.status_code === "OFD")
    return { label: "Out For Delivery", progress: 0 }

  return { label: "Pending", progress: 0 }
}

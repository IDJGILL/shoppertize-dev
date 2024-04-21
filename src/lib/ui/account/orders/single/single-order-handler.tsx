"use client"

import OrderLayout from "~/app/(store)/account/orders/[id]/_components/order-layout"
import LoaderFallBack from "~/app/_components/loader-fallback"
import { api } from "~/lib/server/access/client"
import { type RouterOutputs } from "~/lib/utils/functions/trpc"

interface SingleOrderHandlerProps extends React.HTMLAttributes<HTMLElement> {
  id: string
  initialData: RouterOutputs["store"]["order"]["getOrderById"]
}

export default function SingleOrderHandler({
  ...props
}: SingleOrderHandlerProps) {
  const { id, initialData } = props

  const utils = useSingleOrder({ id, initialData })

  if (utils.error) throw new Error("Something went wrong")

  if (utils.isLoading || utils.isFetching) return <LoaderFallBack />

  return <OrderLayout utils={utils} />
}

export type SingleOrderProps = {
  id: string
  initialData: RouterOutputs["store"]["order"]["getOrderById"]
}

export function useSingleOrder(props: SingleOrderProps) {
  const utils = api.store.order.getOrderById.useQuery(props.id, {
    initialData: props.initialData,
  })

  return utils
}

export type UseSingleOrderOutputType = ReturnType<typeof useSingleOrder>

import { getOrderById } from "~/lib/modules/order/utils/order-apis"
import SingleOrderHandler from "./single-order-handler"

export const dynamic = "force-dynamic"

interface SingleOrderRSCProps extends React.HTMLAttributes<HTMLElement> {
  id: string
}

export default async function SingleOrderRSC({
  ...props
}: SingleOrderRSCProps) {
  const { id } = props

  const data = await getOrderById(id)

  return <SingleOrderHandler id={id} initialData={data} />
}

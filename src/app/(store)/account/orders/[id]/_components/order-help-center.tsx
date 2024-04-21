import { ChevronRight } from "lucide-react"
import { type SingleOrder } from "~/lib/modules/order/utils/order-types"
interface OrderHelpCenterProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function OrderHelpCenter({ ...props }: OrderHelpCenterProps) {
  const {} = props

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 lg:rounded lg:border">
        <div className="text-sm">NEED HELP WITH YOUR ORDER?</div>
        <ChevronRight />
      </div>
    </>
  )
}

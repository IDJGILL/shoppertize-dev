"use client"

import OrderItems from "./order-items"
import OrderAddress from "./order-address"
import OrderSummary from "./order-summary"
import { type UseSingleOrderOutputType } from "~/lib/ui/account/orders/single/single-order-handler"
import OrderDetails from "./order-details"
import ReviewSection from "./review-section"
import OrderTracking from "./order-tracking"

interface OrderLayoutProps extends React.HTMLAttributes<HTMLElement> {
  utils: UseSingleOrderOutputType
}

export default function OrderLayout({ ...props }: OrderLayoutProps) {
  const {
    utils: { data },
  } = props

  return (
    <div className="bg-gray-100 md:py-10 lg:min-h-screen">
      <div className="container px-0 pb-4 lg:flex lg:gap-8">
        <div className="relative lg:w-[70%]">
          <OrderTracking order={data} />

          <OrderItems order={data} />

          <OrderAddress order={data} />

          <OrderDetails order={data} />
        </div>

        <div className="lg:w-[30%]">
          <ReviewSection order={data} />

          <OrderSummary order={data} />
        </div>
      </div>
    </div>
  )
}

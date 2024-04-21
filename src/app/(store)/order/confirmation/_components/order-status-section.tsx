"use client"

import { Animate } from "~/app/_components/framer-client"
import FailedAnimation from "./failed-animation"
import { useOrderContext } from "./order-context"
import SuccessAnimation from "./success-animation"
import { Button } from "~/app/_components/ui/button"
import Link from "next/link"
import { accountNavigations } from "~/lib/utils/constants/navigations"
import { base64 } from "~/lib/utils/functions/base64"

interface OrderStatusSectionProps extends React.HTMLAttributes<HTMLElement> {}

export default function OrderStatusSection({
  ...props
}: OrderStatusSectionProps) {
  const {} = props

  const { data, content } = useOrderContext()

  return (
    <div className="relative w-full">
      <div className="mx-auto w-full max-w-xl py-20">
        {data?.status !== "PAYMENT_SUCCESS" && <FailedAnimation />}

        {data?.status === "PAYMENT_SUCCESS" && <SuccessAnimation />}

        <Animate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <h4 className="mb-3 text-center text-xl font-bold tracking-tight md:text-2xl">
            {content.title}
          </h4>

          <p className="mb-10 text-center text-sm text-muted-foreground md:text-base">
            {content.message}
          </p>

          <div className="mx-auto flex w-max flex-col items-center">
            {data?.status === "PAYMENT_SUCCESS" && (
              <Button size="sm" asChild>
                <Link
                  href={accountNavigations.dynamic.order.path(
                    base64.create(["order", data.orderId]),
                  )}
                >
                  View Order #{data.orderId}
                </Link>
              </Button>
            )}

            {data?.status !== "PAYMENT_SUCCESS" && (
              <Button size="sm">Contact Support</Button>
            )}

            <div>
              <Button
                variant="link"
                className="text-sm text-muted-foreground"
                asChild
              >
                <Link href="/">Keep Shopping</Link>
              </Button>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  )
}

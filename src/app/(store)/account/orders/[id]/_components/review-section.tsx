"use client"

import { useState } from "react"
import Box from "~/app/_components/box"
import { Button } from "~/app/_components/ui/button"
import { type SingleOrder } from "~/lib/modules/order/utils/order-types"
import AddProductReviewModal from "~/lib/modules/review/components/add-product-review-modal"
import metaFinder from "~/lib/utils/functions/meta-finder"

interface ReviewSectionProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

export default function ReviewSection({ ...props }: ReviewSectionProps) {
  const { order } = props
  const [open, openSet] = useState(false)

  const hasReviewableProducts =
    props.order.lineItems.nodes.filter(
      (a) =>
        !metaFinder.safeParse({
          key: `review:${a.productId}`,
          metaData: props.order.metaData,
        }),
    ).length > 0

  if (!hasReviewableProducts || order.status !== "DELIVERED") return

  return (
    <Box title="Review Products" className="">
      <AddProductReviewModal order={order} open={open} onOpenChange={openSet} />

      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          Your review helps us improve our products and shopping experience.
        </p>

        <Button size="sm" onClick={() => openSet(true)}>
          Add Reviews
        </Button>
      </div>
    </Box>
  )
}

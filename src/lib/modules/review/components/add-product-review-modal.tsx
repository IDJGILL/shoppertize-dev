"use client"

import { ModelXDrawer } from "~/app/_components/ui/dialog"
import dynamic from "next/dynamic"
import LoaderFallBack from "~/app/_components/loader-fallback"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import ProductImage from "~/app/_components/product-image"
import { base64 } from "~/lib/utils/functions/base64"
import metaFinder from "~/lib/utils/functions/meta-finder"
import ReviewStars from "~/assets/icons/review-stars.png"
import Image from "next/image"
import { Button } from "~/app/_components/ui/button"
import { api } from "~/lib/server/access/client"
import { type ReviewFormInstance } from "./add-review-form"
import { type SingleOrder } from "../../order/utils/order-types"

const AddReviewForm = dynamic(() => import("./add-review-form"), {
  ssr: false,
  loading: () => <LoaderFallBack className="h-[200px]" />,
})

interface AddProductReviewModalProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
  open: boolean
  onOpenChange: (a: boolean) => void
}

export default function AddProductReviewModal({
  ...props
}: AddProductReviewModalProps) {
  const {} = props

  const [productId, productIdSet] = useState<number | null>(null)

  const [success, successSet] = useState(false)

  const [form, formSet] = useState<ReviewFormInstance>()

  const apiContext = api.useContext()

  const heading = [
    {
      title: "Add Review",
      sub: "Help Us Improve. Let Us Know",
      case: "add",
    },
    {
      title: "Select Product",
      sub: "Please select the product you want to submit the review for.",
      case: "select",
    },
  ]

  const onClose = (a: boolean) => {
    productIdSet(null)
    successSet(false)
    props.onOpenChange(a)

    if (success) {
      void apiContext.store.order.getOrderById.invalidate()
    }
  }

  const isAddingReview = !!productId

  const { mutate, isLoading } = api.review.addOrderReview.useMutation({
    onSuccess: (response) => {
      if (!response.success) {
        return form?.setError("comment", {
          type: "custom",
          message: response.message,
        })
      }

      successSet(true)
    },
  })

  return (
    <ModelXDrawer
      open={props.open}
      onOpenChange={onClose}
      className="w-full !max-w-xl"
      title={!success ? heading[isAddingReview ? 0 : 1]?.title : undefined}
      description={!success ? heading[isAddingReview ? 0 : 1]?.sub : undefined}
    >
      {!isAddingReview && !success && (
        <div>
          <ul className="mb-4 space-y-4">
            {props.order.lineItems.nodes
              .filter(
                (a) =>
                  !metaFinder.safeParse({
                    key: `review:${a.productId}`,
                    metaData: props.order.metaData,
                  }),
              )
              .map((item) => (
                <li
                  key={item.productId}
                  onClick={() => productIdSet(item.productId)}
                  className="flex cursor-pointer items-center"
                >
                  <div className="flex items-center">
                    <div>
                      <ProductImage
                        sourceUrl={item.product.node.image.sourceUrl}
                        lazyLoad
                        className="mr-4 w-[100px] rounded-xl"
                      />
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-sm font-medium">
                        {item.product.node.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </li>
              ))}
          </ul>

          <div className="flex w-full items-center justify-end"></div>
        </div>
      )}

      {isAddingReview && !success && (
        <AddReviewForm
          orderId={
            +(
              base64.safeParse({
                base64Id: props.order.id,
                index: 1,
              }) ?? ""
            )
          }
          productId={productId}
          onFormSubmit={mutate}
          isLoading={isLoading}
          onFormMount={formSet}
        />
      )}

      {success && (
        <div className="flex flex-col items-center">
          <Image
            src={ReviewStars}
            alt=""
            className="mx-auto mb-10 mt-2 max-w-[170px]"
          />

          <h3 className="mb-2 text-center text-xl font-bold">Thank You</h3>

          <p className="max-w-sm text-center text-muted-foreground">
            Your review has been submitted successfully, We really appreciate
            your effort.
          </p>

          <Button
            size="sm"
            className="mx-auto mt-8 rounded-full"
            onClick={() => onClose(false)}
          >
            Ok, Thanks
          </Button>

          <Button variant="link" className="text-sm text-slate-400">
            Shop more
          </Button>
        </div>
      )}
    </ModelXDrawer>
  )
}

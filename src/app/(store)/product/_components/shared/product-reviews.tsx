import { Suspense } from "react"
import Divider from "./section-divider"
import { type Product } from "~/lib/modules/product/utils/product-gql"
import ReviewsList from "~/lib/modules/review/components/reviews-list"

interface ProductReviewsProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
  slug: string
}

export default function ProductReviews({ ...props }: ProductReviewsProps) {
  const {} = props

  if (props.product.reviewCount === 0) return null

  return (
    <div className="px-4 md:px-0">
      <Divider />

      <h3 className="mb-4 text-base font-medium">
        {props.product.reviewCount < 0 ? props.product.reviewCount : null}{" "}
        Reviews
      </h3>

      <Suspense>
        <ReviewsList slug={props.slug} />
      </Suspense>
    </div>
  )
}

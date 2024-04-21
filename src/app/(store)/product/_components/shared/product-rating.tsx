"use client"

import Rating from "~/app/_components/ui/rating"
import { cn } from "~/lib/utils/functions/ui"

interface ProductRatingProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ProductRating({ ...props }: ProductRatingProps) {
  if (props.product.reviewCount === 0) return null

  return (
    <div className={cn("flex items-center gap-3 text-sm", props.className)}>
      <div className="flex items-center">
        <div className="mr-1 font-medium leading-none">
          {props.product.reviews.averageRating}
        </div>

        <Rating
          type="static"
          default={props.product.reviews.averageRating}
          onRatingChange={() => null}
          className="h-5 w-5"
        />
      </div>

      <div className="mt-[2px]">{props.product.reviewCount} ratings</div>
    </div>
  )
}

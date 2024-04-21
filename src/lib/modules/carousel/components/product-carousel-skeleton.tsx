import Skeleton from "react-loading-skeleton"
import { array } from "~/lib/utils/functions/array"

interface ProductCarouselSkeletonProps
  extends React.HTMLAttributes<HTMLElement> {
  cards: number
}

export default function ProductCarouselSkeleton({
  ...props
}: ProductCarouselSkeletonProps) {
  return (
    <div className="overflow-y-auto">
      <div className="flex">
        {array(props.cards).map((_, index) => (
          <div
            key={index}
            className="aspect-[1/1.7] min-w-0 shrink-0 grow-0 basis-[42%] pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 lg:p-4"
          >
            <ProductCarouselCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProductCarouselCardSkeletonProps
  extends React.HTMLAttributes<HTMLElement> {}

export function ProductCarouselCardSkeleton({
  ...props
}: ProductCarouselCardSkeletonProps) {
  const {} = props

  return (
    <div className="">
      <Skeleton className="aspect-[5/5]" />

      <div className="pt-5">
        <Skeleton className="h-3" />
        <div className="w-[80%]">
          <Skeleton className="h-3" />
        </div>
      </div>

      <div>
        <div className="w-[30%]">
          <Skeleton className="h-7" />
        </div>
      </div>
    </div>
  )
}

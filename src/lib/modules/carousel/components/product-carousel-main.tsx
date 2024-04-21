import { Suspense } from "react"
import ProductCarouselRSC from "./product-carousel-rsc"
import type { CarouselOptions } from "../utils/carousel-types"
import { cn } from "~/lib/utils/functions/ui"
import ProductCarouselSkeleton from "./product-carousel-skeleton"

interface ProductCarouselProps extends React.HTMLAttributes<HTMLElement> {
  options: CarouselOptions
}

export default function ProductCarousel({ ...props }: ProductCarouselProps) {
  const { options } = props

  return (
    <div className={cn(props.className)}>
      <h3 className="z-10 flex items-center gap-2 px-0 pb-4 text-xs text-muted-foreground md:mb-0 md:text-base">
        <span className="h-4 w-2 rounded-full bg-primary"></span>
        {props.options.title}
      </h3>

      <Suspense fallback={<ProductCarouselSkeleton cards={6} />}>
        <ProductCarouselRSC options={options} />
      </Suspense>
    </div>
  )
}

"use client"

import ProductCard from "~/app/_components/product-card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/app/_components/ui/carousel"
import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"
import { ProductCarouselCardSkeleton } from "./product-carousel-skeleton"
import { type CarouselProduct } from "../utils/carousel-gql"

interface ProductCarouselDesktopProps
  extends React.HTMLAttributes<HTMLElement> {
  products: CarouselProduct[]
  hasNextPage: boolean
  carouselInstanceSet?: (a: CarouselApi) => void
}

export default function ProductCarouselDesktop({
  ...props
}: ProductCarouselDesktopProps) {
  const { products, hasNextPage, carouselInstanceSet } = props

  const breakPoint = useBreakpoint()

  const getSlideCount = () => {
    switch (breakPoint) {
      case "XL":
        return 6

      case "LG":
        return 4

      case "MD":
        return 4

      case "SM":
        return 3

      default:
        return 2
    }
  }

  const slidesToScroll = getSlideCount()

  return (
    <Carousel
      className="w-full"
      opts={{
        slidesToScroll: slidesToScroll,
      }}
      orientation="horizontal"
      setApi={carouselInstanceSet}
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.slug}
            className="aspect-[1/1.7] h-full basis-[42%] bg-white sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}

        {hasNextPage &&
          Array(slidesToScroll)
            .fill(" ")
            .map((_, index) => (
              <CarouselItem
                key={index}
                className="aspect-[1/1.7] h-full basis-[42%] pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 lg:border lg:p-4"
              >
                <ProductCarouselCardSkeleton />
              </CarouselItem>
            ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

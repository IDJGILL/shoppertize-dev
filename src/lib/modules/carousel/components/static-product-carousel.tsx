"use client"

import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"
import { type StaticCarouselOptions } from "../utils/carousel-types"
import dynamic from "next/dynamic"
import ProductCarouselSkeleton from "./product-carousel-skeleton"

const ProductCarouselDesktop = dynamic(
  () => import("./product-carousel-desktop"),
  { ssr: false, loading: () => <ProductCarouselSkeleton cards={6} /> },
)

const ProductCarouselMobile = dynamic(
  () => import("./product-carousel-mobile"),
  { ssr: false, loading: () => <ProductCarouselSkeleton cards={6} /> },
)

interface StaticProductCarouselProps extends React.HTMLAttributes<HTMLElement> {
  options: StaticCarouselOptions
}

export default function StaticProductCarousel({
  ...props
}: StaticProductCarouselProps) {
  const {
    options: { products },
  } = props

  const breakpoint = useBreakpoint()

  return (
    <>
      {(breakpoint === "XL" || breakpoint === "LG" || breakpoint === "MD") && (
        <ProductCarouselDesktop products={products} hasNextPage={false} />
      )}

      {breakpoint === "SM" && (
        <ProductCarouselMobile
          products={products}
          hasNextPage={false}
          innerRef={null}
        />
      )}
    </>
  )
}

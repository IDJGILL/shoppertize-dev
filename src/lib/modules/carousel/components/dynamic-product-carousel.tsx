"use client"

import { useCallback, useState } from "react"
import { useInView } from "react-intersection-observer"
import type { DynamicCarouselOptions } from "../utils/carousel-types"
import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"
import dynamic from "next/dynamic"
import ProductCarouselSkeleton from "./product-carousel-skeleton"
import { type CarouselApi } from "~/app/_components/ui/carousel"
import { useUpdateEffect } from "react-use"
import { type getCarouselProducts } from "../utils/carousel-apis"
import { api } from "~/vertex/lib/trpc/trpc-context-provider"

const ProductCarouselDesktop = dynamic(
  () => import("./product-carousel-desktop"),
  { ssr: false, loading: () => <ProductCarouselSkeleton cards={6} /> },
)

const ProductCarouselMobile = dynamic(
  () => import("./product-carousel-mobile"),
  { ssr: false, loading: () => <ProductCarouselSkeleton cards={6} /> },
)

interface DynamicProductCarouselProps
  extends React.HTMLAttributes<HTMLElement> {
  initial: Awaited<ReturnType<typeof getCarouselProducts>>
  options: DynamicCarouselOptions
}

export default function DynamicProductCarousel({
  ...props
}: DynamicProductCarouselProps) {
  const {
    options: { category, excludeProducts },
    initial,
  } = props

  const breakpoint = useBreakpoint()

  const [carouselInstance, carouselInstanceSet] = useState<CarouselApi>()
  const [products, productsSet] = useState(initial.data.products)
  const [hasNextPage, hasNextPageSet] = useState(initial.data.hasNextPage)
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false })

  const isDesktop =
    breakpoint === "XL" || breakpoint === "LG" || breakpoint === "MD"

  const isMobile = breakpoint === "SM"

  const { fetchNextPage, isFetchingNextPage } =
    api.carousel.getCarouselProducts.useInfiniteQuery(
      {
        category,
        excludeProducts,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.data.nextCursor
        },
        initialData: {
          pageParams: [],
          pages: [initial],
        },
      },
    )

  const loadMoreDesktopCarouselData = useCallback(
    async (a: NonNullable<CarouselApi>) => {
      if (!isDesktop) return

      const lastSlide = a.slideNodes().length - 1
      const lastSlideInView = a.slidesInView().includes(lastSlide)

      if (!lastSlideInView || isFetchingNextPage) return

      const response = await fetchNextPage()

      const products = response.data?.pages.flatMap((a) => {
        return a.data.products
      })

      if (!!products && products.length !== 0) {
        const lastPage = response.data?.pages[response.data?.pages.length - 1]

        if (!lastPage?.status) return hasNextPageSet(false)

        hasNextPageSet(lastPage.data.hasNextPage)

        productsSet(products)
      }
    },
    [fetchNextPage, isDesktop, isFetchingNextPage],
  )

  const loadMoreMobileCarouselData = useCallback(async () => {
    if (isFetchingNextPage || !inView || !isMobile) return

    const response = await fetchNextPage()

    const products = response.data?.pages.flatMap((a) => {
      if (!a.status) return []

      return a.data.products
    })

    if (!!products && products.length !== 0) {
      const lastPage = response.data?.pages[response.data?.pages.length - 1]

      if (!lastPage?.status) return hasNextPageSet(false)

      hasNextPageSet(lastPage.data.hasNextPage)

      productsSet(products)
    }
  }, [fetchNextPage, inView, isFetchingNextPage, isMobile])

  useUpdateEffect(() => {
    if (!carouselInstance) return

    carouselInstance.on("settle", (a) => {
      void loadMoreDesktopCarouselData(a)
    })
  }, [carouselInstance])

  useUpdateEffect(() => void loadMoreMobileCarouselData(), [inView])

  return (
    <>
      {isDesktop && (
        <ProductCarouselDesktop
          products={products}
          hasNextPage={hasNextPage}
          carouselInstanceSet={carouselInstanceSet}
        />
      )}

      {isMobile && (
        <ProductCarouselMobile
          products={products}
          hasNextPage={hasNextPage}
          innerRef={ref}
        />
      )}
    </>
  )
}

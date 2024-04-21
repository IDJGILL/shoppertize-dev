"use client"

import "swiper/css"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Spinner from "./ui/spinner"
import { cn } from "~/lib/utils/functions/ui"
import { Swiper } from "swiper/react"
import { type UseInfiniteDataOutputType } from "~/lib/utils/hooks/useInfiniteData"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import ProductCard from "./product-card"
import type { Swiper as SwiperType } from "swiper/types"
import Skeleton from "react-loading-skeleton"

interface DesktopCarouselProps extends React.HTMLAttributes<HTMLElement> {
  instance: (swiper: SwiperType) => void
  onPositionChange: (swiperPosition: {
    activeIndex: number
    isBeginning: boolean
    isEnd: boolean
  }) => void
}

export function DesktopCarousel({ ...props }: DesktopCarouselProps) {
  const { instance, onPositionChange } = props

  return (
    <Swiper
      onSwiper={instance}
      spaceBetween={0}
      slidesPerView={6}
      slidesPerGroup={6}
      onActiveIndexChange={(s) =>
        onPositionChange({
          activeIndex: s.activeIndex,
          isBeginning: s.isBeginning,
          isEnd: s.isEnd,
        })
      }
      className="px-4"
    >
      {props.children}
    </Swiper>
  )
}

interface CarouselTriggerNextProps extends React.HTMLAttributes<HTMLElement> {
  next: () => void
  isEnded: boolean
  isHidden: boolean
}

export function CarouselTriggerNext({ ...props }: CarouselTriggerNextProps) {
  return (
    <button
      className={cn(
        "absolute right-0 top-1/2 z-[5000] hidden -translate-y-1/2 rounded-l-md bg-white px-2 py-8 opacity-50 shadow-md hover:bg-secondary hover:text-white group-hover:opacity-100 md:block",
        {
          "cursor-not-allowed !opacity-40": props.isEnded,
          "!hidden": props.isHidden,
        },
      )}
      onClick={() => props.next()}
    >
      <ChevronRight />
    </button>
  )
}

interface CarouselTriggerPrevProps extends React.HTMLAttributes<HTMLElement> {
  prev: () => void
  isBeginning: boolean
  isHidden: boolean
}

export function CarouselTriggerPrev({ ...props }: CarouselTriggerPrevProps) {
  return (
    <button
      className={cn(
        "absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-r-md bg-white px-2 py-8 shadow-md hover:bg-secondary hover:text-white group-hover:opacity-100 md:block",
        {
          "cursor-not-allowed !opacity-40": props.isBeginning,
          "!hidden": props.isHidden,
        },
      )}
      onClick={() => props.prev()}
    >
      <ChevronLeft />
    </button>
  )
}

export function CarouselCardLoader() {
  return (
    <div className="flex aspect-[4/5] h-full flex-col items-center justify-center">
      <Spinner className="stroke-foreground" />
    </div>
  )
}

interface InfiniteMobileCarouselProps
  extends React.HTMLAttributes<HTMLElement> {
  utils: UseInfiniteDataOutputType<Product>
}

export function InfiniteMobileCarousel({ utils }: InfiniteMobileCarouselProps) {
  const { loadMore, isFetching, isLoading, isLast } = utils

  const { ref, inView } = useInView()

  useEffect(() => {
    if (isFetching || isLoading || isLast) return

    if (inView) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadMore()
    }
  }, [inView])

  return (
    <LimitedMobileCarousel
      products={utils.all}
      loader={
        !utils.isLast && (
          <div
            ref={ref}
            className="flex h-full min-w-[160px] items-center justify-center"
          >
            <Spinner className="stroke-foreground" />
          </div>
        )
      }
    />
  )
}

interface LimitedMobileCarouselProps extends React.HTMLAttributes<HTMLElement> {
  products: Product[]
  loader?: React.ReactNode
}

export function LimitedMobileCarousel({
  ...props
}: LimitedMobileCarouselProps) {
  const { products } = props

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <div className="flex flex-nowrap">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="min-w-[164px] pl-4"
          />
        ))}

        {!!props.loader && props.loader}
      </div>
    </div>
  )
}

interface CarouselSkeletonCardsProps extends React.HTMLAttributes<HTMLElement> {
  count: number
}

export function CarouselSkeletonCards({
  ...props
}: CarouselSkeletonCardsProps) {
  const {} = props

  const items = Array.from({ length: props.count }, (_, i) => i)

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="flex w-full flex-nowrap">
        {items.map((item) => (
          <div key={item} className="ml-2 aspect-[4/5] w-full min-w-[180px]">
            <Skeleton className="aspect-[4/5] h-[200px] w-full" />

            <div className="mt-1 w-full">
              <Skeleton className="w-full" />
            </div>

            <div className="mt-1 w-12">
              <Skeleton className="w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

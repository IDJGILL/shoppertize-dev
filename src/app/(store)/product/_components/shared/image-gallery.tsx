"use client"

import Skeleton from "react-loading-skeleton"
import dynamic from "next/dynamic"
import { useAtom } from "jotai"
import { fullScreenProductViewAtom } from "./state"
import { useEffect } from "react"
import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"
import LoaderFallBack from "~/app/_components/loader-fallback"

const DynamicDesktopGallery = dynamic(() => import("./gallery-desktop"), {
  ssr: false,
  loading: ({ error, isLoading }) => {
    if (!!error) {
      return <div>Something went wrong</div>
    }

    if (isLoading) {
      return <GallerySkeleton />
    }

    return null
  },
})

const DynamicFullScreenDesktopGallery = dynamic(
  () => import("./fullscreen-gallery-desktop"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-x-0 top-0 z-[10000] h-[100dvh] w-full bg-black bg-opacity-40">
        <LoaderFallBack />
      </div>
    ),
  },
)

const DynamicMobileGallery = dynamic(() => import("./gallery-mobile"), {
  ssr: false,
  loading: ({ error, isLoading }) => {
    if (!!error) {
      return <div>Something went wrong</div>
    }

    if (isLoading) {
      return <GallerySkeleton isMobile />
    }

    return null
  },
})

const DynamicMobileFullScreenGallery = dynamic(
  () => import("./fullscreen-gallery-mobile"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-x-0 top-0 z-[10000] h-[100dvh] w-full bg-black bg-opacity-40">
        <LoaderFallBack />
      </div>
    ),
  },
)

interface ImageGalleryProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ImageGallery({ ...props }: ImageGalleryProps) {
  const { product } = props

  const breakpoint = useBreakpoint()

  const [isOpen, setFullScreen] = useAtom(fullScreenProductViewAtom)

  useEffect(() => {
    if (isOpen.view) {
      setFullScreen({ view: null, index: 0 })
    }
  }, [setFullScreen])

  const isDesktop =
    breakpoint === "XL" || breakpoint === "LG" || breakpoint === "MD"

  const isMobile = breakpoint === "SM"

  return (
    <div>
      {/* Desktop Slider */}
      {isDesktop && <DynamicDesktopGallery product={product} />}

      {/* Full Screen Slider */}
      {isDesktop && isOpen.view === "desktop" && (
        <DynamicFullScreenDesktopGallery product={product} isOpen={isOpen} />
      )}

      {/* Mobile Slider */}
      {isMobile && <DynamicMobileGallery product={product} />}

      {/* Full Screen Slider */}
      {isMobile && isOpen.view === "mobile" && (
        <DynamicMobileFullScreenGallery product={product} isOpen={isOpen} />
      )}
    </div>
  )
}

interface GallerySkeletonProps extends React.HTMLAttributes<HTMLElement> {
  isMobile?: boolean
}

function GallerySkeleton({ ...props }: GallerySkeletonProps) {
  const { isMobile } = props

  if (!isMobile) {
    return (
      <div className="hidden w-full gap-4 md:flex">
        <div className="flex flex-col gap-4">
          <div className="w-24">
            <Skeleton className="h-[125px] w-full" />
          </div>
          <div className="w-24">
            <Skeleton className="h-[125px] w-full" />
          </div>
          <div className="w-24">
            <Skeleton className="h-[125px] w-full" />
          </div>
          <div className="w-24">
            <Skeleton className="h-[125px] w-full" />
          </div>
        </div>

        <div className="flex-1">
          <Skeleton className="h-[560px] w-full flex-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full md:hidden">
      <Skeleton className="min-h-[400px] w-full flex-1" />
    </div>
  )
}

import { useAtom } from "jotai"
import {
  type FullScreenProductViewAtomType,
  fullScreenProductViewAtom,
} from "./state"
import type { Swiper as SwiperInstance } from "swiper"
import { useEffect, useState } from "react"
import ImageSlider from "./image-slider"
import ImageSelector from "./image-selector"
import { ModelXDrawer } from "~/app/_components/ui/dialog"

interface FullScreenMobileGalleryProps
  extends React.HTMLAttributes<HTMLElement> {
  product: Product
  isOpen: FullScreenProductViewAtomType
}

export default function FullScreenMobileGallery({
  ...props
}: FullScreenMobileGalleryProps) {
  const { product, isOpen } = props
  const [, setOpen] = useAtom(fullScreenProductViewAtom)
  const [firstSwiper, setFirstSwiper] = useState<SwiperInstance | null>(null)
  const [secondSwiper, setSecondSwiper] = useState<SwiperInstance | null>(null)

  useEffect(() => {
    if (firstSwiper) {
      firstSwiper.slideTo(isOpen?.index ?? 0)
    }
  }, [firstSwiper])

  const images = product.galleryImages.nodes.map((a) => a.sourceUrl)

  return (
    <ModelXDrawer
      // title="Product Gallery"
      open={isOpen.view === "mobile"}
      onOpenChange={() =>
        setOpen({
          view: null,
          index: 0,
        })
      }
      className="flex flex-col justify-between p-0"
      height="screen"
    >
      <div className="flex h-full flex-col justify-between">
        <ImageSlider
          images={images}
          options={{
            type: "dynamic",
            zoom: true,
            onSlideChange: (instance) => {
              setFirstSwiper(instance)
            },
            controller: secondSwiper,
          }}
        />

        <ImageSelector
          images={images}
          options={{
            type: "dynamic",
            orientation: "horizontal",
            controller: firstSwiper,
            onSliderChange: setSecondSwiper,
          }}
        />
      </div>
    </ModelXDrawer>
  )
}

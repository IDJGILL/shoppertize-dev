"use client"

import { useState } from "react"
import { useAtom } from "jotai"
import ImageSlider from "./image-slider"
import { fullScreenProductViewAtom } from "./state"
import ImageSelector from "./image-selector"

interface DesktopGalleryProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function DesktopGallery({ ...props }: DesktopGalleryProps) {
  const { product } = props

  const [imageIndex, setIndex] = useState(0)
  const [, setOpen] = useAtom(fullScreenProductViewAtom)

  const images = product.galleryImages.nodes.map((a) => a.sourceUrl)

  return (
    <div className="h-full">
      <div className="sticky left-0 top-28 flex gap-4">
        <ImageSelector
          images={images}
          options={{
            type: "static",
            orientation: "vertical",
            onHover: (activeIndex) => {
              setIndex(activeIndex)
            },
            activeIndex: imageIndex,
          }}
        />

        <div>
          <ImageSlider
            images={images}
            options={{
              type: "static",
              currentIndex: imageIndex,
              onClick: (activeIndex) => {
                setOpen({
                  view: "desktop",
                  index: activeIndex,
                })
              },
            }}
          />

          <div className="py-2 text-center text-sm">
            Click to open expanded view
          </div>
        </div>
      </div>
    </div>
  )
}

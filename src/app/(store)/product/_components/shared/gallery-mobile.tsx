import { useAtom } from "jotai"
import ImageSlider from "./image-slider"
import { fullScreenProductViewAtom } from "./state"

interface MobileGalleryProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function MobileGallery({ ...props }: MobileGalleryProps) {
  const { product } = props

  const [, setOpen] = useAtom(fullScreenProductViewAtom)

  const images = product.galleryImages.nodes.map((a) => a.sourceUrl)

  return (
    <div>
      <ImageSlider
        images={images}
        options={{
          type: "dynamic",
          zoom: false,
          onClick: (activeIndex) => {
            setOpen({
              view: "mobile",
              index: activeIndex,
            })
          },
        }}
      />
    </div>
  )
}

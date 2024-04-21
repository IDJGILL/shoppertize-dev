import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import Image from "next/image"
import {
  type FullScreenProductViewAtomType,
  fullScreenProductViewAtom,
} from "./state"
import { ModelXDrawer } from "~/app/_components/ui/dialog"

interface FullScreenDesktopGalleryProps
  extends React.HTMLAttributes<HTMLElement> {
  product: Product
  isOpen: FullScreenProductViewAtomType
}

export default function FullScreenDesktopGallery({
  ...props
}: FullScreenDesktopGalleryProps) {
  const { product, isOpen } = props

  const [, setOpen] = useAtom(fullScreenProductViewAtom)

  const [imageIndex, setIndex] = useState(0)

  useEffect(() => setIndex(isOpen?.index ?? 0), [isOpen])

  return (
    <ModelXDrawer
      title="Product Gallery"
      open={isOpen.view === "desktop"}
      onOpenChange={() =>
        setOpen({
          view: null,
          index: 0,
        })
      }
      className="w-full lg:max-w-[80dvw]"
    >
      <div className="flex h-full gap-8">
        <div className="relative h-[calc(30dvw)] flex-1">
          <Image
            src={product.galleryImages.nodes[imageIndex]?.sourceUrl ?? "/"}
            alt=""
            fill
            className="h-full w-full object-contain"
          />
        </div>

        <div className="w-[25%]">
          <h3 className="mb-5 text-lg  tracking-tighter">
            {props.product.name}
          </h3>

          <div className="flex flex-wrap gap-4">
            {props.product.galleryImages.nodes
              .map((a) => a.sourceUrl)
              .map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  width={60}
                  height={60}
                  alt=""
                  className="aspect-square cursor-pointer rounded-md border object-contain"
                  onMouseOver={() => {
                    setIndex(index)
                  }}
                  onClick={() => {
                    setIndex(index)
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </ModelXDrawer>
  )
}

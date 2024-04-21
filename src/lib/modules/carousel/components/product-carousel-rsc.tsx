import dynamic from "next/dynamic"
import { getCarouselProducts } from "../utils/carousel-apis"
import type { CarouselOptions } from "../utils/carousel-types"

const DynamicProductCarousel = dynamic(
  () => import("./dynamic-product-carousel"),
  { ssr: true },
)

const StaticProductCarousel = dynamic(
  () => import("./static-product-carousel"),
  { ssr: true },
)

interface ProductCarouselRSCProps extends React.HTMLAttributes<HTMLElement> {
  options: CarouselOptions
}

export default async function ProductCarouselRSC({
  ...props
}: ProductCarouselRSCProps) {
  const { options } = props

  switch (options.type) {
    case "dynamic":
      const response = await getCarouselProducts({
        category: options.category,
        excludeProducts: options.excludeProducts,
      })

      return <DynamicProductCarousel initial={response} options={options} />

    case "static":
      return <StaticProductCarousel options={options} />

    default:
      return null
  }
}

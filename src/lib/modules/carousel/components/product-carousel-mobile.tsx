import ProductCard from "~/app/_components/product-card"
import { ProductCarouselCardSkeleton } from "./product-carousel-skeleton"
import { array } from "~/lib/utils/functions/array"

interface ProductCarouselMobileProps extends React.HTMLAttributes<HTMLElement> {
  products: Product[]
  hasNextPage: boolean
  innerRef: ((node?: Element | null | undefined) => void) | null
}

export default function ProductCarouselMobile({
  ...props
}: ProductCarouselMobileProps) {
  const { products, hasNextPage, innerRef } = props

  return (
    <section className="overflow-x-auto">
      <div className="flex py-2">
        {products.map((product) => (
          <div
            key={product.name}
            className="aspect-[1/1.7] min-w-0 shrink-0 grow-0 basis-[42%] border-white pl-2 hover:border-border sm:basis-1/3 md:basis-1/4 lg:basis-1/6 lg:border lg:p-4"
          >
            <ProductCard product={product} />
          </div>
        ))}

        {hasNextPage &&
          array(3).map((_, index) => (
            <div
              key={index}
              ref={index === 0 ? innerRef : null}
              className="aspect-[1/1.7] min-w-0 shrink-0 grow-0 basis-[42%] border-white pl-2 hover:border-border sm:basis-1/3 md:basis-1/4 lg:basis-1/6 lg:border lg:p-4"
            >
              <ProductCarouselCardSkeleton />
            </div>
          ))}
      </div>
    </section>
  )
}

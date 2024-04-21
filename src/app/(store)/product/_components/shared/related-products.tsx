import Divider from "./section-divider"
import { ProductCarousel } from "~/lib/modules/carousel/components"

interface RelatedProductsProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
  slug: string
}

export default function RelatedProducts({ ...props }: RelatedProductsProps) {
  const { product, slug } = props

  const parent = product.productCategories.nodes[0]?.slug

  const child = product.productCategories.nodes[1]?.slug

  if (!child) return null

  return (
    <section>
      <Divider className="my-8" />

      <ProductCarousel
        options={{
          title: "Products related to this item",
          type: "dynamic",
          category: parent ?? child,
          excludeProducts: [slug],
        }}
      />
    </section>
  )
}

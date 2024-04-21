import { type UseInfiniteDataOutputType } from "~/lib/utils/hooks/useInfiniteData"
import ProductCard from "./product-card"

interface ProductListProps extends React.HTMLAttributes<HTMLElement> {
  utils: UseInfiniteDataOutputType<Product>
}

export default function ProductList({ ...props }: ProductListProps) {
  const {
    utils: { all },
  } = props

  return (
    <div className="container py-4">
      <ul className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
        {all.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </ul>
    </div>
  )
}

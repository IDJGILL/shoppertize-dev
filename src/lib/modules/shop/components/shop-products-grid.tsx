"use client"

import type { ProductsByFilters } from "../utils/shop-types"
import ProductCard from "~/app/_components/product-card"
import { useShopContext, useShopProducts } from "../utils/shop-context"
import LoaderFallBack from "~/app/_components/loader-fallback"

interface ShopProductsGridProps extends React.HTMLAttributes<HTMLElement> {
  initialData: ProductsByFilters
}

export default function ShopProductsGrid({ ...props }: ShopProductsGridProps) {
  const { initialData } = props

  const { filter } = useShopContext()

  const { products, ref, hasNextPage, isLoading } = useShopProducts({
    initialData,
    taxonomyFilter: filter.taxonomy,
  })

  if (isLoading) return <LoaderFallBack />

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((b) => (
          <ProductCard key={b.name} product={b} className="rounded-none" />
        ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex h-24 w-full items-center justify-center">
          <LoaderFallBack className="h-max w-full" />
        </div>
      )}
    </>
  )
}

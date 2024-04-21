"use client"

import { useProductHistory } from "~/app/_lib/product-history-store"
import Divider from "./section-divider"
import useStore from "~/lib/utils/hooks/useStore"
import { ProductCarousel } from "~/lib/modules/carousel/components"

interface BrowsedProductsProps extends React.HTMLAttributes<HTMLElement> {
  excludeItemIds: string[]
}

export default function BrowsedProducts({ ...props }: BrowsedProductsProps) {
  const { excludeItemIds } = props

  const products = useStore({
    store: useProductHistory,
    callback: (store) => store.products,
  })

  if (!products || products.length === 0) return null

  const excludedProducts = products.filter(
    (a) => !excludeItemIds.includes(a.slug),
  )

  return (
    <>
      <Divider className="my-8" />

      <ProductCarousel
        options={{
          title: "Based on your Browsing history",
          type: "static",
          products: excludedProducts,
        }}
      />
    </>
  )
}

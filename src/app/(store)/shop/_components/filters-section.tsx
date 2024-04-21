"use client"

import {
  ShopCollectionFilters,
  ShopProductSortFilters,
} from "~/lib/modules/shop/components/shop-collection-filters"
import { cn } from "~/lib/utils/functions/ui"

interface FiltersSectionProps extends React.HTMLAttributes<HTMLElement> {}

export default function FiltersSection({ ...props }: FiltersSectionProps) {
  const {} = props

  return (
    <div
      className={cn(
        "hidden w-[20%] flex-col gap-8 border-r py-5 pr-4 md:flex",
        props.className,
      )}
    >
      <ShopCollectionFilters title="Filter By:" />

      <ShopProductSortFilters title="Sort By:" />
    </div>
  )
}

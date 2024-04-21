"use clint"

import { ArrowDownUp, Filter } from "lucide-react"
import { useState } from "react"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { cn } from "~/lib/utils/functions/ui"
import { useShopContext } from "~/lib/modules/shop/utils/shop-context"
import {
  ShopCollectionFilters,
  ShopProductSortFilters,
} from "~/lib/modules/shop/components/shop-collection-filters"

interface FiltersFooterProps extends React.HTMLAttributes<HTMLElement> {}

export default function FiltersFooter({ ...props }: FiltersFooterProps) {
  const {} = props
  const [openFilter, openFilterSet] = useState(false)
  const [openSort, openSortSet] = useState(false)

  const { filters } = useShopContext()

  const hasFilters = !!filters

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[10000] flex bg-white shadow-[0px_-2px_25px_0px_#e2e8f0] md:hidden">
        <div
          className={cn(
            "flex h-16 flex-1 items-center justify-center border-r font-medium",
            {
              "opacity-50": !hasFilters,
            },
          )}
          onClick={() => hasFilters && openFilterSet(true)}
        >
          <Filter className="mr-2 h-5 w-5" /> Filter
        </div>

        <div
          className="flex h-16 flex-1 items-center justify-center font-medium"
          onClick={() => openSortSet(true)}
        >
          <ArrowDownUp className="mr-2 h-5 w-5" /> Sort
        </div>
      </div>

      <ModelXDrawer
        open={openFilter}
        onOpenChange={openFilterSet}
        title="Filter By"
      >
        <ShopCollectionFilters className="py-5" />
      </ModelXDrawer>

      <ModelXDrawer
        open={openSort}
        onOpenChange={openSortSet}
        title="Filter By"
      >
        <ShopProductSortFilters className="py-5" />
      </ModelXDrawer>
    </>
  )
}

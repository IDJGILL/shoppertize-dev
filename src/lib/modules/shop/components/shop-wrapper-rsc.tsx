import { type ComponentType } from "react"
import { type Filters } from "../utils/shop-types"
import { getFilters } from "../utils/shop-apis"
import ShopContextProvider from "../utils/shop-context"

export default async function ShopWrapperRsc(
  search: ServerComponentParams,
  Component: ComponentType<{ filters: Filters | null }>,
) {
  const collection = search.params.slug!

  const filters = await getFilters({
    taxonomyFilter: {
      filter: {
        ids: [],
        operator: "IN",
        taxonomy: "PRODUCT_CAT",
        terms: [collection],
      },
      relation: "AND",
    },
  })

  return (
    <ShopContextProvider slug={search.params.slug ?? ""} filters={filters}>
      <Component filters={filters} />
    </ShopContextProvider>
  )
}

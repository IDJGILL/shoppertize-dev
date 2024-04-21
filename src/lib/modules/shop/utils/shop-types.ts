import type { CheckedState } from "@radix-ui/react-checkbox"

export type Filters = {
  collections: {
    main: Collection[]
    others: never[]
  }
  attributes: {
    options: string[]
    id: string
    name: string
    label: string
    variation: boolean
    visible: boolean
  }[]
}

type Collection = {
  id: string
  name: string
  count: number
  slug: string
  isActive: boolean
}

export type ApiFiltersData = {
  products: {
    nodes: Array<{
      id: string
      attributes: {
        nodes: Array<Attribute>
      }
    }>
  }
  productCategory: {
    id: string
    name: string
    slug: string
    count: number
    children: {
      nodes: Array<{
        id: string
        name: string
        count: number
        slug: string
      }>
    }
  }
}

export type ProductsByFilters = {
  nextCursor: string | undefined
  data: Product[]
  found: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type FilterContextProps = {
  handleChange: (props: HandleParamChangeProps) => void
  checkActiveParam: (value: string, param: FilterParam) => boolean
  products: Product[]
  filters: Filters
  loadMore: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
}

export type HandleParamChangeProps = {
  show: CheckedState
  value: string
  param: FilterParam
  dataType: "multiple" | "single"
}

export type Sort = "latest" | "price-asc" | "price-desc"

export type FilterParam = "include" | "sort" | "search"

export type GetFilterParamsProps = {
  collectionSlug: string
  searchKeyword: string | null
  joinedCollectionIds: string | null
}

export type TaxonomyFilter = {
  filter: {
    ids: number[]
    operator: "IN"
    taxonomy: string
    terms: string[]
  }
  relation: "AND"
}

export type UseShopProductProps = {
  taxonomyFilter: TaxonomyFilter
  initialData: ProductsByFilters
}

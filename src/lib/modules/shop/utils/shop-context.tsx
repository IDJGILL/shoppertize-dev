"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { createTaxonomyFilter, sortFilteredProducts } from "./shop-apis"
import type {
  Filters,
  Sort,
  TaxonomyFilter,
  UseShopProductProps,
} from "./shop-types"
import { type DebouncedState, useDebouncedCallback } from "use-debounce"
import {
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation"
import { base64 } from "~/lib/utils/functions/base64"
import { api } from "~/lib/server/access/client"
import { useUpdateEffect } from "react-use"
import { useInView } from "react-intersection-observer"
import { replaceText } from "~/lib/utils/functions/replace-text"

type SetCollectionProps =
  | { type: "sort" | "collection"; value: Sort; remove?: boolean }
  | { type: "collection"; value: string; remove?: boolean }

type ShopContextProps = {
  title: string
  filter: {
    taxonomy: TaxonomyFilter
    sort?: Sort | undefined
  }
  filterHandler: DebouncedState<(props: SetCollectionProps) => void>
  filters: Filters | null
  searchParams: ReadonlyURLSearchParams
}

const ShopContext = createContext<ShopContextProps | null>(null)

interface ShopContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  slug: string
  filters: Filters | null
}

export default function ShopContextProvider({
  ...props
}: ShopContextProviderProps) {
  const { filters } = props

  const searchParams = useSearchParams()

  const initialTaxonomy = createTaxonomyFilter({
    slug: props.slug,
    search: searchParams.get("search"),
    include: searchParams.get("include"),
  })

  const router = useRouter()

  const [filter, filterSet] = useState<ShopContextProps["filter"]>({
    taxonomy: initialTaxonomy,
    sort: searchParams.get("sort") as Sort,
  })

  const filterHandler = useDebouncedCallback((props: SetCollectionProps) => {
    const prevCollection = filter.taxonomy.filter.ids

    const joinedCollections = props.remove
      ? [...prevCollection.filter((a) => a !== +props.value)]
      : [...prevCollection, +props.value]

    switch (props.type) {
      case "collection": {
        filterSet({
          sort: filter.sort,
          taxonomy: {
            filter: {
              ...initialTaxonomy.filter,
              ids: joinedCollections,
            },
            relation: filter.taxonomy.relation,
          },
        })

        break
      }

      case "sort": {
        filterSet({
          taxonomy: filter.taxonomy,
          sort: !props.remove ? props.value : undefined,
        })
      }
    }
  }, 200)

  const updatedFilter = useMemo(() => {
    if (!filters) return null

    return {
      ...filters,
      collections: {
        ...filters.collections,
        main: filters.collections.main.map((a) => ({
          ...a,
          isActive: filter.taxonomy.filter.ids.includes(
            +base64.parse<number>({ base64Id: a.id, index: 1 }),
          ),
        })),
      },
    }
  }, [filters, filter.taxonomy.filter.ids])

  const title =
    searchParams.get("search") ??
    replaceText({
      source: props.slug.split("-").join(" ") ?? "",
      matcher: "and",
      replaceWith: "&",
    })

  const values = {
    title,
    filter,
    filterHandler,
    filters: updatedFilter,
    searchParams,
  }

  useUpdateEffect(() => {
    const paramsObject = {
      include: !!filter.taxonomy.filter.ids.length
        ? filter.taxonomy.filter.ids.join("-")
        : null,
      sort: filter.sort ?? null,
    } satisfies Record<string, string | null>

    const conditionalParamObject = Object.fromEntries(
      Object.entries(paramsObject)
        .map(([key, value]) => {
          if (!!value) {
            return [key, value]
          }
          return [] as const
        })
        .filter((entry) => entry.length > 0),
    ) as Record<string, string>

    const params = new URLSearchParams(conditionalParamObject)

    router.replace(`?${params.toString()}`)
  }, [router, filter.taxonomy.filter.ids, filter.sort])

  return (
    <ShopContext.Provider value={values}>{props.children}</ShopContext.Provider>
  )
}

export const useShopContext = () => {
  const context = useContext(ShopContext)

  if (!context) throw new Error("Child not wrapped in context")

  return context
}

export const useShopProducts = (props: UseShopProductProps) => {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = api.shop.collection.useInfiniteQuery(
    {
      taxonomyFilter: props.taxonomyFilter,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const searchParams = useSearchParams()

  const products = useMemo(() => {
    const initialProducts =
      data?.pages.flatMap((a) => a.data) ?? props.initialData.data

    return sortFilteredProducts(
      initialProducts,
      searchParams.get("sort") as Sort,
    )
  }, [data?.pages, props.initialData.data, searchParams])

  const canFetchNext =
    inView && hasNextPage && !isLoading && !isFetching && !isFetchingNextPage

  useUpdateEffect(() => {
    if (!canFetchNext) return

    void fetchNextPage()
  }, [inView, data])

  return {
    products: products ?? [],
    ref,
    fetchNextPage,
    hasNextPage,
    isLoading,
  }
}

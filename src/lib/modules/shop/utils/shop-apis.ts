import { publicQuery } from "~/lib/server/access/graphql"
import type {
  Filters,
  ApiFiltersData,
  ProductsByFilters,
  TaxonomyFilter,
  Sort,
} from "./shop-types"
import {
  type TaxonomyFilterSchemaProps,
  type CollectionProductsSchemaProps,
} from "./shop-schemas"
import {
  GET_COLLECTION_SLUGS,
  GetFilters,
  ProductsByFiltersQuery,
} from "./shop-gql"
import { flatMap, groupBy, map, uniq } from "lodash-es"

export const getFilters = async (
  props: TaxonomyFilterSchemaProps,
): Promise<Filters | null> => {
  const { taxonomyFilter } = props

  const response = await publicQuery<ApiFiltersData>({
    query: GetFilters,
    variables: {
      id: taxonomyFilter.filter.terms[0],
      taxonomyFilter: {
        filters: [taxonomyFilter.filter],
        relation: taxonomyFilter.relation,
      },
    },
    caching: "force-cache",
    cacheTags: ["shop"],
  }).catch(null)

  if (response.error ?? !response.data) return null

  return transformApiFiltersData(response.data)
}

export const getCollectionProducts = async (
  props: CollectionProductsSchemaProps,
): Promise<ProductsByFilters> => {
  const { cursor, taxonomyFilter, excludeItemIds } = props

  const response = await publicQuery<{ products: Infinite<Product> }>({
    query: ProductsByFiltersQuery,
    variables: {
      first: 8,
      after: cursor,
      taxonomyFilter: {
        filters: [taxonomyFilter.filter],
        relation: taxonomyFilter.relation,
      },
    },
    caching: "force-cache",
    cacheTags: ["shop"],
  })

  const products = response.data.products.edges
    .map((a) => ({
      ...a.node,
      ...(a.node.type === "VARIABLE" && {
        price: a.node.price.split(", ")[0]!,
      }),
    }))
    .filter((b) => !excludeItemIds?.includes(b.slug || b.id))

  let nextCursor: string | undefined = undefined

  if (response.data.products.pageInfo.hasNextPage) {
    const lastItem =
      response.data.products.edges[response.data.products.edges.length - 1]

    nextCursor = lastItem ? lastItem.cursor : undefined
  } else {
    nextCursor = undefined
  }

  return {
    nextCursor,
    data: products,
    found: response.data.products.found,
    hasNextPage: response.data.products.pageInfo.hasNextPage,
    hasPreviousPage: response.data.products.pageInfo.hasPreviousPage,
  }
}

export const getCollectionSlugs = async () => {
  const request = await publicQuery<{
    productCategories: { nodes: { slug: string }[] }
  }>({
    query: GET_COLLECTION_SLUGS,
    variables: {},
    caching: "force-cache",
    cacheTags: [],
  })

  return request.data.productCategories.nodes
}

type CreateTaxonomyFilterProps = {
  slug: string
  search: string | null
  include: string | null
}

export const createTaxonomyFilter = (props: CreateTaxonomyFilterProps) => {
  return {
    filter: {
      ids: !!props.search ? [] : props.include?.split("-").map(Number) ?? [],
      operator: "IN",
      taxonomy: !!props.search ? "PRODUCT_TAG" : "PRODUCT_CAT",
      terms: !!props.search ? [props.search] : [props.slug],
    },
    relation: "AND",
  } satisfies TaxonomyFilter
}

export const transformApiFiltersData = (data: ApiFiltersData) => {
  const filters: Filters = {
    collections: {
      main: [],
      others: [],
    },
    attributes: [],
  } satisfies Filters

  const category = data.productCategory?.children.nodes

  if (category?.length) {
    filters.collections.main.push(
      ...category.map((a) => ({ ...a, isActive: false })),
    )
  }

  const products = data.products.nodes

  products.forEach((product) => {
    product.attributes.nodes.forEach((attribute) => {
      const isExist = filters.attributes.includes(attribute)

      if (!isExist) {
        filters.attributes.push(attribute)
      }
    })
  })

  const groupedAttributes = groupBy(filters.attributes, "name")

  const attributes = map(groupedAttributes, (group) => {
    const combinedOptions = uniq<string>(flatMap(group, "options"))

    const attribute = group[0]

    if (!attribute) throw new Error("Attribute not found")

    return {
      ...attribute,
      options: combinedOptions,
    }
  })

  const refinedFilters = {
    collections: {
      main: filters.collections.main,
      others: [],
    },
    attributes: attributes,
  } satisfies Filters

  return refinedFilters
}

export const sortFilteredProducts = (
  products: Product[] | undefined,
  sort: Sort | null,
) => {
  if (!sort || !products) return products

  switch (sort) {
    case "latest":
      return products.sort((a) => (new Date(a.date) < new Date() ? -1 : 1))

    case "price-asc":
      return products.sort((a, b) => (+a.price < +b.price ? -1 : 1))

    case "price-desc":
      return products.sort((a, b) => (+a.price > +b.price ? -1 : 1))

    default:
      return products
  }
}

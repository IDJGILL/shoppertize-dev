import { ApiCarouselSchema, type ApiCarouselSchemaProps } from "./carousel-schemas"
import { CarouselProductsGql, type CarouselProductsGqlData, type CarouselProductsGqlInputs } from "./carousel-gql"
import { client } from "~/lib/graphql/client"
import { createTRPCRouter, publicProcedure, wrapTRPC } from "~/vertex/lib/trpc/trpc-config"

export const getCarouselProducts = async (props: ApiCarouselSchemaProps) => {
  return await wrapTRPC(async (response) => {
    const { cursor, excludeProducts, category } = props

    const taxonomyFilter: ProductTaxonomyInput = {
      filters: [
        {
          ids: [],
          operator: "IN",
          taxonomy: "PRODUCT_CAT",
          terms: [category],
        },
      ],
      relation: "AND",
    }

    const data = await client<CarouselProductsGqlData, CarouselProductsGqlInputs>({
      access: "public",
      query: CarouselProductsGql,
      inputs: {
        first: 12,
        after: cursor ?? "",
        taxonomyFilter,
      },
      cacheTags: ["carousel-products", "products"],
    })

    const products = data.products.edges
      .map((a) => a.node)
      .filter((b) => !excludeProducts?.includes(b.slug ?? (b.id as string)))

    let nextCursor: string | undefined = undefined

    if (data.products.pageInfo.hasNextPage) {
      const lastItem = data.products.edges[data.products.edges.length - 1]

      nextCursor = lastItem ? lastItem.cursor : undefined
    } else {
      nextCursor = undefined
    }

    return response.success({
      action: "none",
      data: {
        nextCursor,
        products,
        found: data.products.found,
        hasNextPage: data.products.pageInfo.hasNextPage,
        hasPreviousPage: data.products.pageInfo.hasPreviousPage,
      },
    })
  })
}

export const carouselRouter = createTRPCRouter({
  getCarouselProducts: publicProcedure
    .input(ApiCarouselSchema)
    .query(async ({ input }) => await getCarouselProducts(input)),
})

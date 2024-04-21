import { client } from "~/lib/graphql/client"
import {
  SearchDataGql,
  GetProductsSlugGql,
  GetSingleProductGql,
  ProductCategoriesGql,
  type GetProductsSlugGqlData,
  type GetSingleProductGqlData,
  type GetSingleProductGqlInput,
  type SearchDataGqlData,
  type SearchDataGqlInput,
  type ProductCategoriesGqlData,
} from "./product-gql"
import type { Category, SearchTerm } from "./product-types"
import { createTRPCRouter, publicProcedure } from "~/vertex/lib/trpc/trpc-init"

export const getProductBySlug = async (slug: string) => {
  const data = await client<GetSingleProductGqlData, GetSingleProductGqlInput>({
    access: "public",
    inputs: {
      id: slug,
    },
    query: GetSingleProductGql,
    cacheTags: [],
  })

  return data.product
}

export const getProductSlugs = async () => {
  const data = await client<GetProductsSlugGqlData>({
    access: "public",
    query: GetProductsSlugGql,
    cacheTags: [],
  })

  return data.products.nodes
}

export const getProductSearchData = async () => {
  const data = await client<SearchDataGqlData, SearchDataGqlInput>({
    access: "public",
    query: SearchDataGql,
    cacheTags: [],
  })

  const products = data.products.nodes

  const searchTerms: SearchTerm[] = products.reduce<SearchTerm[]>(
    (acc, product) => {
      if (
        !product.productCategories.nodes.length ||
        !product.productTags?.nodes.length
      ) {
        return acc
      }

      const categorySlug =
        product.productCategories.nodes.length > 1
          ? product.productCategories.nodes[1]!.slug
          : product.productCategories.nodes[0]!.slug

      product.productTags.nodes.forEach((tag) => {
        if (acc.some((item) => item.title === tag.name)) {
          return acc
        }

        if (
          !product.productCategories?.nodes.length ||
          !product.productTags?.nodes.length
        ) {
          return acc
        }

        acc.push({
          title: tag.name,
          slug: `${categorySlug}?search=${tag.name}`,
          tags: [tag.name, product.name],
        })
      })

      return acc
    },
    [],
  )

  return searchTerms
}

export const getProductCategories = async () => {
  const data = await client<ProductCategoriesGqlData>({
    access: "public",
    query: ProductCategoriesGql,
    cacheTags: [],
  })

  const excludeCategories = [
    "todays-deal",
    "new-arrivals",
    "best-sellers",
    "all-products",
  ]

  const categories = data.productCategories.nodes
    .reduce<Category[]>((acc, item) => {
      const isParent = item.parentId !== null

      if (!isParent) {
        acc.push({
          id: item.id as string,
          name: item.name,
          slug: item.slug,
          childrens: [
            ...item.children.nodes.map((child) => ({
              id: child.id as string,
              name: child.name,
              slug: child.slug,
            })),
            ...(item.children.nodes.length > 0
              ? [
                  {
                    id: "all",
                    name: "-- View all categories",
                    slug: item.slug,
                  },
                ]
              : []),
          ],

          hasChildren: item.children.nodes.length > 0,
        })
      }

      return acc
    }, [])
    .filter((a) => !excludeCategories.includes(a.slug))

  return categories
}

// export const getImages = async (imageIds: string[]) => {
//   const imagesResponse = await adminQuery<MediaItems>(
//     `query getImages($in: [ID] = []) {
//         mediaItems(where: {in: $in}) {
//           nodes {
//             sourceUrl
//           }
//         }
//       }`,
//     { in: imageIds },
//     "force-cache",
//   )

//   if (imagesResponse.error) {
//     throw new Error("Failed to fetch images")
//   }

//   if (imagesResponse.data.mediaItems.nodes.length === 0) {
//     throw new Error(
//       `No images found for ids: ${imageIds.join(
//         ", ",
//       )}, Please add images to the product.`,
//     )
//   }

//   return imagesResponse.data.mediaItems.nodes
// }

export const productRouter = createTRPCRouter({
  searchData: publicProcedure.mutation(
    async () => await getProductSearchData(),
  ),
})

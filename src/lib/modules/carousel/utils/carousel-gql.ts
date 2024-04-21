export const CarouselProductsGql = `
query CarouselProductsQuery(
  $after: String = ""
  $first: Int = 8
  $taxonomyFilter: ProductTaxonomyInput = {}
) {
  products(
    first: $first
    after: $after
    where: { taxonomyFilter: $taxonomyFilter }
  ) {
    found
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        type
        slug
        name
        ... on SimpleProduct {
          date
          price(format: RAW)
          regularPrice(format: RAW)
          image {
            sourceUrl
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          reviews {
            averageRating
          }
        }
        reviewCount
      }
    }
  }
}
`

export type CarouselProductsGqlData = {
  products: {
    edges: {
      cursor: string
      node: CarouselProduct
    }[]
  } & EdgesProperties
}

export type CarouselProduct = Pick<
  GqlDataProps,
  | "id"
  | "type"
  | "slug"
  | "name"
  | "date"
  | "price"
  | "regularPrice"
  | "image"
  | "galleryImages"
  | "reviewCount"
> & { reviews: Pick<ReviewsProperties, "averageRating"> }

export type CarouselProductsGqlInputs = Pick<
  GqlInputProps,
  "after" | "first" | "taxonomyFilter"
>

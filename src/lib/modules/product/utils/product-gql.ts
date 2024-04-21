export const GetSingleProductGql = `
query GetSingleProductGql($id: ID = "", $idType: ProductIdTypeEnum = SLUG) {
  product(id: $id, idType: $idType) {
    id
    type
    slug
    name
    reviewCount
    productCategories {
      nodes {
        id
        name
        slug
      }
    }
    reviews {
      averageRating
    }
    image {
      sourceUrl
    }
    galleryImages {
      nodes {
        sourceUrl
      }
    }
    metaData {
      key
      value
    }
    ... on SimpleProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      stockStatus
      stockQuantity
      lowStockAmount
      manageStock
    }
  }
}
`

export type GetSingleProductGqlData = {
  product: Product
}

export type GetSingleProductGqlInput = Pick<GqlInputProps, "id">

export type Product = Pick<
  GqlDataProps,
  | "id"
  | "type"
  | "slug"
  | "name"
  | "reviewCount"
  | "productCategories"
  | "image"
  | "galleryImages"
  | "metaData"
  | "price"
  | "regularPrice"
  | "stockStatus"
  | "stockQuantity"
  | "lowStockAmount"
  | "manageStock"
> & { reviews: Pick<ReviewsProperties, "averageRating"> }

/* 
  
Space -_-
  
*/

export type GetProductStockDetailsGqlInput = Pick<GqlInputProps, "id">

/* 
  
Space -_-
  
*/

export const GetProductsSlugGql = `
query GetProductsSlugGql {
  products(first: 500, where: {status: "publish"}) {
    nodes {
      slug
    }
  }
}
`

export type GetProductsSlugGqlData = {
  products: {
    nodes: Pick<GqlDataProps, "slug">[]
  }
}

export const SearchDataGql = `
query SearchDataGql {
  products(where: {status: "publish"}, first: 500) {
    nodes {
      id
      name
      ... on SimpleProduct {
        id
        name
        productCategories(where: {childless: true}) {
          nodes {
            id
            name
            slug
          }
        }
        productTags {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
}
`

export type SearchDataGqlData = {
  products: {
    nodes: Pick<
      GqlDataProps,
      "id" | "name" | "productCategories" | "productTags"
    >[]
  }
}

export type SearchDataGqlInput = Pick<GqlInputProps, "status">

export const ProductCategoriesGql = `
query ProductCategoriesGql {
  productCategories(where: {hideEmpty: true}, first: 500) {
    nodes {
      id
      name
      slug
      parentId
      children {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
}
`

export type ProductCategoriesGqlData = {
  productCategories: {
    nodes: (Pick<GqlDataProps, "id" | "name" | "slug" | "parentId"> & {
      children: {
        nodes: Pick<GqlDataProps, "id" | "name" | "slug">[]
      }
    })[]
  }
}

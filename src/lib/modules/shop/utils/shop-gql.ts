export const GetFilters = `
query GetFilters($id: ID = "", $taxonomyFilter: ProductTaxonomyInput = {}) {
  products(where: {type: VARIABLE, taxonomyFilter: $taxonomyFilter}, first: 500) {
    nodes {
      id
      ... on VariableProduct {
        id
        attributes {
          nodes {
            id
            label
            name
            options
            position
          }
        }
      }
    }
  }
  productCategory(id: $id, idType: SLUG) {
    databaseId
    name
    slug
    count
    children {
      nodes {
        id
        name
        count
        slug
      }
    }
  }
}
`

export const ProductsByFiltersQuery = `
query ProductsByFiltersQuery($after: String = "", $taxonomyFilter: ProductTaxonomyInput = {}, $first: Int = 8) {
  products(first: $first, after: $after, where: {taxonomyFilter: $taxonomyFilter}) {
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
        ... on VariableProduct {
          date
          name
          price(format: RAW)
          attributes {
            nodes {
              id
              label
              name
              options
              position
            }
          }
          image {
            sourceUrl
          }
          variations {
            nodes {
              id
              name
              price(format: RAW)
              regularPrice(format: RAW)
              image {
                sourceUrl
              }
              attributes {
                nodes {
                  id
                  name
                  value
                }
              }
              metaData {
                id
                key
                value
              }
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
export const GET_COLLECTION_SLUGS = `
query GetCollectionSlugs {
  productCategories(where: {hideEmpty: true}, first: 1000) {
    nodes {
      slug
    }
  }
}
`

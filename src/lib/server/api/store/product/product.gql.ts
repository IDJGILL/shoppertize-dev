/* ## Queries ## */

export const GET_INFINITE_PRODUCTS = `
query GET_INFINITE_PRODUCTS($after: String = "", $taxonomyFilter: ProductTaxonomyInput = {}) {
  products(first: 8, after: $after, where: {taxonomyFilter: $taxonomyFilter}) {
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

export const GET_COLLECTION_FILTERS = `
query collectionFilters($id: ID = "", $taxonomyFilter: ProductTaxonomyInput = {}) {
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
    id
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

import { graphql } from "gql.tada"

export const GetProducts = graphql(`
  query NewQuery {
    products {
      edges {
        node {
          name
          slug
          type
        }
      }
    }
  }
`)

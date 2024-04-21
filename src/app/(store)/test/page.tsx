import { graphql } from "gql.tada"
import React from "react"
import { client } from "~/lib/graphql/client"

const GetProducts = graphql(`
  query MyQuery1 {
    product(id: "1635", idType: DATABASE_ID) {
      date
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
  }
`)

export default async function Test() {
  type GenericProperties = {
    date: string
    image: Image | null
    galleryImages: { nodes: Image[] }
  }

  type Image = { sourceUrl: string }

  type Product = Pick<GenericProperties, "date" | "galleryImages" | "image">

  const data = await client({
    access: "public",
    query: GetProducts,
    cacheTags: [],
  })

  return <div>Test</div>
}

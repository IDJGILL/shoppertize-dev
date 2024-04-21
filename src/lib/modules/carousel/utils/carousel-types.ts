import { type CarouselProduct } from "./carousel-gql"

export type CarouselOptions = DynamicCarouselOptions | StaticCarouselOptions

export type DynamicCarouselOptions = {
  title?: string
  type: "dynamic"
  category: string
  excludeProducts?: string[]
}

export type StaticCarouselOptions = {
  title?: string
  type: "static"
  products: CarouselProduct[]
  excludeProducts?: string[]
}

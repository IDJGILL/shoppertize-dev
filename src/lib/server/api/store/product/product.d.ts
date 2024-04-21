// type Infinite<TData> = {
//   edges: Array<{
//     cursor: string
//     node: TData
//   }>
//   found: number
//   pageInfo: {
//     startCursor: string
//     endCursor: string
//     hasNextPage: boolean
//     hasPreviousPage: boolean
//   }
// }

// type InfiniteReviews<TData> = {
//   edges: Array<{
//     cursor: string
//     rating: number
//     node: TData
//   }>
//   found: number
//   pageInfo: {
//     startCursor: string
//     endCursor: string
//     hasNextPage: boolean
//     hasPreviousPage: boolean
//   }
// }

// // type Product = {
// //   id: string
// //   slug: string
// //   name: string
// //   image: ProductImage
// //   galleryImages: {
// //     nodes: Array<ProductImage>
// //   }
// //   reviewCount: number
// //   reviews: {
// //     averageRating: number
// //   }
// //   metaData: MetaData[]
// //   productCategories: {
// //     nodes: ProductCategory[]
// //   }
// // } & (SimpleProduct | VariableProduct)

// type MetaData = {
//   key: string
//   value: string
// }

// type SimpleProduct = {
//   type: "SIMPLE"
//   id: string
//   slug: string
//   name: string
//   date: string
//   price: string
//   regularPrice: string
//   image: ProductImage
//   galleryImages: {
//     nodes: Array<ProductImage>
//   }
//   reviewCount: number
//   reviews: {
//     averageRating: number
//   }
//   productCategories: {
//     nodes: ProductCategory[]
//   }
//   metaData: MetaData[]
//   stockStatus: StockStatus
//   stockQuantity: number
//   lowStockAmount: number
//   manageStock: "FALSE" | "PARENT" | "TRUE"
// }

// type VariableProduct = {
//   type: "VARIABLE"
//   id: string
//   slug: string
//   name: string
//   date: string
//   price: string
//   metaData: MetaData[]
//   attributes: {
//     nodes: Array<Attribute>
//   }
//   variations: {
//     nodes: Array<Variation>
//   }
// }

// type Variation = {
//   id: string
//   name: string
//   price: string
//   slug: string // Not from server
//   regularPrice: string
//   image: ProductImage
//   metaData: Array<MetaData> | null
//   variationImages: Array<ProductImage>
//   attributes: {
//     nodes: VariationAttribute[]
//   }
//   stockStatus: StockStatus
//   stockQuantity: number
//   // lowStockAmount: number; Not working at this moment using default value of 10
//   manageStock: "FALSE" | "PARENT" | "TRUE"
// }

// type CollectionFilterData = {
//   products: {
//     nodes: Array<{
//       id: string
//       attributes: {
//         nodes: Array<Attribute>
//       }
//     }>
//   }
//   productCategory: {
//     id: string
//     name: string
//     slug: string
//     count: number
//     children: {
//       nodes: Array<{
//         id: string
//         name: string
//         count: number
//         slug: string
//       }>
//     }
//   }
// }

// type MediaItems = {
//   mediaItems: {
//     nodes: Array<ProductImage>
//   }
// }

// type TransformedSearchParams = {
//   searchParams: DynamicObject<string[]> | null
//   params: Record<string, string>
// }

// type SortFilter = {
//   field: "date" | "name" | "price"
//   order: "asc" | "desc"
//   keyword: string
// }

// type AddParams = (key: string, values: Array<string>) => void

// type InitialProductsData = {
//   initialData: InfiniteData<{
//     data: Product[]
//     nextCursor: string | undefined
//     hasNextPage: string
//     hasPreviousPage: string
//   }>
//   taxonomyFilter: TaxonomyFilters
// }

// type VariationOption = {
//   id: string
//   name: string
//   label: string
//   options: Array<{
//     option: string
//     isInStock: boolean
//     isActive: boolean
//   }>
// }

// type InitialFiltersData = {
//   filters: Filters
//   taxonomyFilter: TaxonomyFilters
// }

// type InfiniteData<TData = unknown> = {
//   pages: TData[]
//   pageParams: unknown[]
// }

// type Review = {
//   rating: number
//   commentId: number
//   date: string
//   author: {
//     node: {
//       id: string
//       name: string
//     }
//   }
//   content: string
// }

// type InfiniteProductSliderOptions = {
//   title?: string
//   category: string
//   excludeItemIds?: string[]
//   isMobile: boolean
// }

// type ProductTag = {
//   name: string
//   slug: string
// }

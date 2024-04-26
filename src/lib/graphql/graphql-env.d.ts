/* 
  
Other Types
  
*/

type GqlProductSettingsProps = {
  allowedShippingPincodes: string | null
  allowedShippingStates: string | null
  hasCashOnDelivery: boolean
  hasReturnExchange: boolean
}

type OrderProperties = {
  status: OrderStatusEnum
  datePaid: string
  dateCompleted: string
  lineItems: {
    nodes: {
      productId: number
      quantity: number
    }[]
  }
}

type ReviewProperties = {
  status: ReviewStatusEnum
}

type AuthorProperties = {
  name
  id
}

type ProductTag = {
  name: string
  slug: string
}

type CartItemQuantityInput = {
  key: string
  quantity: number
}

type ProductCategory = {
  id: string
  name: string
  slug: string
}

type ReviewsProperties = {
  averageRating: number
}

type ProductTaxonomyInput = {
  filters: ProductTaxonomyFilterInput[]
  relation: RelationEnum
}

type ProductTaxonomyFilterInput = {
  ids: number[]
  operator: TaxonomyOperatorEnum
  taxonomy: ProductTaxonomyEnum
  terms: string[]
}

type ImageNode = {
  sourceUrl: string
}

type EdgesProperties = {
  found: number
  pageInfo: {
    startCursor: string
    endCursor: string
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// ENUMS

type GqlDataProps = {
  id: string | number
  databaseId: number
  name: string
  type: ProductTypesEnum
  slug: string
  date: string
  price: string | null
  regularPrice: string | null
  image: ImageNode
  galleryImages: {
    nodes: ImageNode[]
  }
  reviewCount: number
  productCategories: {
    nodes: ProductCategory[]
  }
  metaData: MetaData[]
  stockStatus: StockStatusEnum
  stockQuantity: number | null
  lowStockAmount: number | null
  manageStock: ManageStockEnum
  userMetaData: {
    emailVerification: true | null
    phoneVerification: true | null
  }
  authToken: string
  refreshToken: string
  productTags: {
    nodes: ProductTag[]
  }
  parentId: string | number | null
  cursor: string
  rating: number
  content: string
  clientMutationId: string
  title: string
  key: string
  taxClass: string
  taxStatus: TaxStatusEnum
  quantity: number
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  postcode: string | null
  city: string | null
  state: string | null
  country: string | null
  address1: string | null
  address2: string | null
  company: string | null
  authTokenExpiration: string
  refreshTokenExpiration: string
}

type GqlInputProps = {
  id: string | number
  first: number
  after: string
  taxonomyFilter: ProductTaxonomyInput
  idType: UserNodeIdTypeEnum
  refreshToken: string
  status: "publish"
  rating: number
  authorEmail: string
  author: string
  commentOn: number
  content: string
  orderId: number
  metaData: MetaData[]
  title: string
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  customerId: number
  key: string
  identity: string
  include: number[]
  productId: number
  quantity: number
  keys: string[]
  all: boolean
}

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

type MetaData = {
  key: string
  value: string
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

type TaxStatusEnum = "NONE" | "SHIPPING" | "TAXABLE"

type ReviewStatusEnum = "APPROVE" | "HOLD" | "SPAM" | "TRASH"

type OrderStatusEnum =
  | "CANCELLED"
  | "Cancelled"
  | "CHECKOUT_DRAFT"
  | "DELIVERED"
  | "DISPATCHED"
  | "FAILED"
  | "INTRANSIT"
  | "PACKED"
  | "PROCESSING"
  | "READYTODISPATCH"
  | "REFUNDED"

type UserNodeIdTypeEnum =
  | "DATABASE_ID"
  | "EMAIL"
  | "ID"
  | "SLUG"
  | "URI"
  | "USERNAME"

type ManageStockEnum = "FALSE" | "PARENT" | "TRUE"

type StockStatusEnum = "IN_STOCK" | "ON_BACKORDER" | "OUT_OF_STOCK"

type TaxonomyOperatorEnum = "AND" | "EXISTS" | "IN" | "NOT_EXISTS" | "NOT_IN"

type RelationEnum = "AND" | "OR"

type ProductTaxonomyEnum =
  | "PA_BRANDS"
  | "PA_COLOR"
  | "PA_SIZE"
  | "PRODUCT_CAT"
  | "PRODUCT_SHIPPING_CLASS"
  | "PRODUCT_TAG"
  | "PRODUCT_TYPE"
  | "PRODUCT_VISIBILITY"

type ProductTypesEnum =
  | "EXTERNAL"
  | "GROUPED"
  | "SIMPLE"
  | "VARIABLE"
  | "VARIATION"

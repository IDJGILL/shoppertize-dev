import type { cacheTagList, metaKeys, pathList, redisPrefixList } from "./global-constants"

export type Path = (typeof pathList)[number]

export type CacheTag = (typeof cacheTagList)[number]

export type RedisIDPrefix = (typeof redisPrefixList)[number]

export type MetaKey = (typeof metaKeys)[number]

export type PickDataFields<T extends keyof DataFields> = Pick<DataFields, T>

export type PickInputFields<T extends keyof InputFields> = Pick<InputFields, T>

export type DataFields = {
  id: string | number
  databaseId: number
  name: string
  username: string
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

export type InputFields = {
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
  keysIn: MetaKey[]
}

export type ImageNode = {
  sourceUrl: string
}

export type ProductCategory = {
  id: string
  name: string
  slug: string
}

export type MetaData = {
  key: MetaKey
  value: string
}

export type GqlProductSettingsProps = {
  allowedShippingPincodes: string | null
  allowedShippingStates: string | null
  hasCashOnDelivery: boolean
  hasReturnExchange: boolean
}

export type ProductTypesEnum = "EXTERNAL" | "GROUPED" | "SIMPLE" | "VARIABLE" | "VARIATION"

export type UserNodeIdTypeEnum = "DATABASE_ID" | "EMAIL" | "ID" | "SLUG" | "URI" | "USERNAME"

export type ManageStockEnum = "FALSE" | "PARENT" | "TRUE"

export type StockStatusEnum = "IN_STOCK" | "ON_BACKORDER" | "OUT_OF_STOCK"

export type TaxonomyOperatorEnum = "AND" | "EXISTS" | "IN" | "NOT_EXISTS" | "NOT_IN"

export type RelationEnum = "AND" | "OR"

type TaxStatusEnum = "NONE" | "SHIPPING" | "TAXABLE"

export type ReviewStatusEnum = "APPROVE" | "HOLD" | "SPAM" | "TRASH"

export type OrderStatusEnum =
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

export type ProductTaxonomyEnum =
  | "PA_BRANDS"
  | "PA_COLOR"
  | "PA_SIZE"
  | "PRODUCT_CAT"
  | "PRODUCT_SHIPPING_CLASS"
  | "PRODUCT_TAG"
  | "PRODUCT_TYPE"
  | "PRODUCT_VISIBILITY"

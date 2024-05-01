import { type DiscountTypeEnum } from "~/vertex/global/global-types"

export type Coupon = {
  id: number
  code: string
  description: string
  discountType: DiscountTypeEnum
  amount: number
  date: string
  dateExpiry: string | null
  emailRestrictions: string[] | null
  usageCount: number
  usageLimit: number | null
  usageLimitPerUser: number | null
  products: number[]
  excludedProducts: number[]
  productCategories: number[]
  excludedProductCategories: number[]
}

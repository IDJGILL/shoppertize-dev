import { type PickDataFields } from "~/vertex/global/global-types"

export const GetCouponsGql = `
query GetUserMetaDataGql {
  coupons(first: 1000) {
    nodes {
      databaseId
      code
      description
      discountType
      amount
      date
      dateExpiry
      emailRestrictions
      usageCount
      usageLimit
      usageLimitPerUser
      productCategories(first: 1000) {
        nodes {
          databaseId
        }
      }
      excludedProductCategories(first: 1000) {
        nodes {
          databaseId
        }
      }
      products(first: 1000) {
        nodes {
          databaseId
        }
      }
      excludedProducts(first: 1000) {
        nodes {
          databaseId
        }
      }
    }
  }
}
`

export type GetCouponsGqlResponse = {
  coupons: {
    nodes: (PickDataFields<
      | "databaseId"
      | "code"
      | "description"
      | "discountType"
      | "amount"
      | "date"
      | "dateExpiry"
      | "emailRestrictions"
      | "usageLimit"
      | "usageCount"
      | "usageLimitPerUser"
    > & {
      productCategories: { nodes: { databaseId: number }[] }
      excludedProductCategories: { nodes: { databaseId: number }[] }
      products: { nodes: { databaseId: number }[] }
      excludedProducts: { nodes: { databaseId: number }[] }
    })[]
  }
}

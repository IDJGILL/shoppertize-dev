import { keyBy } from "lodash-es"
import { wpClient } from "~/vertex/lib/wordpress/wordpress-client"
import { GetCouponsGql, type GetCouponsGqlResponse } from "./coupon-gql"
import { type Coupon } from "./coupon-types"

export const seedCoupons = async () => {
  const response = await wpClient<GetCouponsGqlResponse, unknown>({ access: "admin", query: GetCouponsGql })

  const payload: Coupon[] = response.coupons.nodes.map((a) => ({
    ...a,
    id: a.databaseId,
    products: a.products.nodes.map((a) => a.databaseId),
    excludedProducts: a.excludedProducts.nodes.map((a) => a.databaseId),
    productCategories: a.productCategories.nodes.map((a) => a.databaseId),
    excludedProductCategories: a.excludedProductCategories.nodes.map((a) => a.databaseId),
  }))

  //   await redisClient.hset("coupons", keyBy(payload, "code"))

  return keyBy(payload, "code")
}

import "server-only"

import { wpClient } from "~/vertex/lib/wordpress/wordpress-client"
import { GetCouponsGql, type GetCouponsGqlResponse } from "./coupon-gql"
import { type Coupon } from "./coupon-types"
import { redisHashGet, redisHashGetAll, redisHashSet } from "~/vertex/lib/redis/redis-utils"
import { CartItemData } from "../cart/cart-types"

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

  await redisHashSet({ id: "@data/coupons", payload, key: "code" })
}

export const getCoupons = async () => {
  const data = await redisHashGetAll<Coupon>({ id: "@data/coupons" })

  return Object.entries(data).map(([_, coupon]) => coupon)
}

export const getCoupon = async (code: string) => {
  return await redisHashGet<Coupon>({ id: "@data/coupons", key: code })
}

type Condition = {
  type:
    | "dateExpiry"
    | "emailRestrictions"
    | "usageLimit"
    | "usageLimitPerUser"
    | "productCategories"
    | "excludedProductCategories"
    | "products"
    | "excludedProducts"
  desc: string
}

export const checkCouponConditions = (coupon: Coupon, cart: CartItemData, email: string): Condition | true => {
  const { dateExpiry, emailRestrictions, usageLimit, usageCount, usageLimitPerUser } = coupon
  // if dateExpiry is enabled, then check if coupon expired
  if (dateExpiry && new Date(dateExpiry).getTime() >= new Date().getTime()) {
    return { type: "dateExpiry", desc: "Coupon has been expired." }
  }

  // if emailRestrictions is enabled, then check if user email is allowed.
  if (emailRestrictions && !emailRestrictions.includes(email)) {
    return { type: "emailRestrictions", desc: "You are not allowed to use this coupon." }
  }

  // if usageLimit is enabled, then check if it exceeded
  if (usageLimit && usageLimit === usageCount) {
    return { type: "usageLimit", desc: "Coupon hit the maximum usage limit." }
  }

  // if usageLimitPerUser is enabled, then check if it exceeded
  if (usageLimitPerUser && usageLimitPerUser) {
  }

  // if productCategories is enabled, then check if is exists in the cart.
  // if excludedProductCategories is enabled, then check if is exists in the cart.
  // if products is enabled, then check if is exists in the cart.
  // if excludedProducts is enabled, then check if is exists in the cart.

  return true

  const conditions = {
    //   dateExpiry: "2024-05-31T18:30:00+00:00",
    //   emailRestrictions: ["inderjeetgill.me@gmail.com"],
    //   usageCount: 0,
    //   usageLimit: 100,
    //   usageLimitPerUser: 1,
    //   productCategories: [],
    //   excludedProductCategories: [],
    //   products: [],
    //   excludedProducts: [],
  }
}

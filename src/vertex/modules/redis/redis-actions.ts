"use server"

import { z } from "zod"
import { redisClient } from "~/lib/redis/redis-client"
import { publicAction } from "~/vertex/lib/action"
import { type GetAllProductsStockDetailsGqlResponse } from "../cart/cart-gql"
import {
  getAllProductsStockDetails,
  getProductStockDetails,
} from "../cart/cart-server-utils"
import { base64 } from "~/lib/utils/functions/base64"

const $Cache = z.object({
  productId: z.string(),
})

export const getCachedProductStock = publicAction($Cache, async (input) => {
  const data = await redisClient.get<
    GetAllProductsStockDetailsGqlResponse["products"]["nodes"][number]
  >(`@cache/product/stock/${input.productId}`)

  return data
})

export const syncAllProductsStockDetails = async () => {
  const data = await getAllProductsStockDetails()

  const responses = await Promise.allSettled(
    data.map((a) =>
      redisClient.set(`@cache/product/stock/${a.id}`, JSON.stringify(a)),
    ),
  )

  const fulfilled = responses.filter((a) => a.status === "fulfilled")

  const rejected = responses.filter((a) => a.status === "rejected")

  return {
    fulfilled,
    rejected,
  }
}

export const syncProductStockDetails = async (id: string) => {
  const data = await getProductStockDetails(id)

  if (!data) throw new Error("Product does not exit or invalid id")

  const baseId = base64.create(["product", id])

  const response = await redisClient.set(
    `@cache/product/stock/${baseId}`,
    JSON.stringify(data),
  )

  if (!response) throw new Error("Something went wrong")

  return true
}

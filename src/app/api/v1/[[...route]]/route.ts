import { Hono } from "hono"
import { handle } from "hono/vercel"
import {
  syncAllProductsStockDetails,
  syncProductStockDetails,
} from "~/vertex/modules/redis/redis-actions"

export const runtime = "edge"

const route = new Hono().basePath("/api/v1")

route.get("/sync/product/stock/all", async (c) => {
  try {
    const response = await syncAllProductsStockDetails()

    return c.json({
      status: true,
      message: "Success",
      result: response,
    })
  } catch {
    return c.json({
      status: true,
      message: "Something went wrong",
    })
  }
})

route.get("/sync/product/stock/:[id]", async (c) => {
  try {
    const id = c.req.param("[id]")

    if (!id || typeof id !== "string") {
      return c.json({
        status: true,
        message: "Invalid product id",
      })
    }

    const response = await syncProductStockDetails(id)

    return c.json({
      status: true,
      message: "Success",
      result: response,
    })
  } catch {
    return c.json({
      status: true,
      message: "Something went wrong",
    })
  }
})

export const GET = handle(route)

export const POST = handle(route)

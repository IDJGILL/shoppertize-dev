import { adminQuery } from "~/lib/server/access/graphql"
import { GET_NEW_ORDER } from "./order.gql"
import { TRPCError } from "@trpc/server"
import metaFinder from "~/lib/utils/functions/meta-finder"
import { base64 } from "~/lib/utils/functions/base64"
import { GET_ITEMS_FOR_VALIDATION } from "../checkout/checkout.gql"
import { revalidateTag } from "next/cache"
import { verifyOrderConfirmationToken } from "~/lib/utils/functions/jwt"
import { checkPhonepePaymentStatus } from "../payment/phonepe/phonepe.modules"
import type {
  ConfirmationResponse,
  MetaData,
} from "~/lib/modules/order/utils/order-types"

export const getRecentOrder = async (transactionReferenceId: string) => {
  const customerId = base64.parse<string>({
    base64Id: transactionReferenceId,
    index: 1,
  })

  const orderResponse = await adminQuery<{
    orders: {
      edges: {
        node: {
          orderNumber: string
          metaData: MetaData[]
        }
      }[]
    }
  }>(
    GET_NEW_ORDER,
    {
      customerId: +customerId,
      keysIn: ["transaction_reference_id"],
    },
    "no-cache",
  )

  if (orderResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch order",
    })
  }

  const order = orderResponse.data.orders.edges[0]?.node

  if (!order) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch order",
    })
  }

  return {
    orderId: order.orderNumber,
    transactionReferenceId: metaFinder.parse<string>({
      metaData: order.metaData,
      key: "transaction_reference_id",
    }),
  }
}

export const checkCartIntegrity = async (
  records: LineItem[],
  method: PaymentMethod,
) => {
  const productsResponse = await adminQuery<{
    products: {
      nodes: {
        type: ProductType
        databaseId: string
        stockStatus: StockStatus
        stockQuantity: number
        productSettings: {
          hasCashOnDelivery: true | null
          hasReturnExchange: true | null
        }
        variations?: {
          nodes: {
            databaseId: string
            stockStatus: StockStatus
            stockQuantity: number
          }[]
        }
      }[]
    }
  }>(
    GET_ITEMS_FOR_VALIDATION,
    { include: records.map((item) => item.product_id) },
    "no-cache",
  )

  const hasCodDisabledItems = productsResponse.data.products.nodes.some(
    (a) => a.productSettings.hasCashOnDelivery === null,
  )

  const simpleProducts = productsResponse.data.products.nodes.filter(
    (item) => item.type === "SIMPLE",
  )

  const variationProducts = productsResponse.data.products.nodes
    .filter((a) => a.type === "VARIABLE")
    .flatMap((b) => b.variations?.nodes)
    .filter(
      (c) =>
        !!records
          .map((d) => d.variation_id)
          .find((e) => e === +(c?.databaseId ?? 0)),
    )

  const hasOutOfStockSimpleItems = simpleProducts.some(
    (a) => a.stockStatus === "OUT_OF_STOCK" || a.stockQuantity === 0,
  )

  const hasOverQuantityItems = simpleProducts.some(
    (a) =>
      (records.find((b) => b.product_id === +a.databaseId)?.quantity ?? 0) >
      a.stockQuantity,
  )

  const hasOutOfStockVariableItems = variationProducts.some(
    (a) => a?.stockStatus === "OUT_OF_STOCK" || a?.stockQuantity === 0,
  )

  const hasOverQuantityVariableItems = variationProducts.some(
    (a) =>
      (records.find((b) => b.variation_id === +(a?.databaseId ?? 0))
        ?.quantity ?? 0) > (a?.stockQuantity ?? 0),
  )

  /* All items must have cod available if method is cod */
  if (method === "COD" && hasCodDisabledItems) {
    revalidateTag("cart")

    return false
  }

  /* The items have quantity that are not in stock */
  if (hasOverQuantityItems || hasOverQuantityVariableItems) {
    revalidateTag("cart")

    return false
  }

  /* The items that have been out of stock */
  if (hasOutOfStockSimpleItems || hasOutOfStockVariableItems) {
    revalidateTag("cart")

    return false
  }

  return true
}

export const verifyOrderConfirmation = async (
  token: string,
): Promise<ConfirmationResponse> => {
  const payload = await verifyOrderConfirmationToken(token)

  if (payload === null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid token",
    })
  }

  const id = payload.id

  if (payload.method === "ONLINE") {
    const status = await checkPhonepePaymentStatus(id)

    const order = await getRecentOrder(id)

    if (order.transactionReferenceId !== id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      })
    }

    if (status === "PAYMENT_SUCCESS") {
      return {
        status: "PAYMENT_SUCCESS",
        orderId: order.orderId,
      }
    }

    return {
      status: "PAYMENT_ERROR",
      orderId: null,
    }
  }

  if (payload.method === "COD") {
    const orderId = base64.parse<string>({
      base64Id: id,
      index: 2,
    })

    return {
      status: "PAYMENT_SUCCESS",
      orderId,
    }
  }

  if (payload.method === "WALLET") {
    const orderId = base64.parse<string>({
      base64Id: id,
      index: 2,
    })

    return {
      status: "PAYMENT_SUCCESS",
      orderId: orderId,
    }
  }

  throw new TRPCError({
    code: "BAD_REQUEST",
    message: "Invalid token",
  })
}

export const debugLog = async (payload: unknown) => {
  return await fetch("https://4r9tl1g1-3000.inc1.devtunnels.ms/api/debug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
    body: JSON.stringify(payload),
  })
}

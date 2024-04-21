import { type SingleOrder } from "~/lib/modules/order/utils/order-types"
import { decodeBase64Id } from "./decodeBase64Id"
import metaFinder from "./meta-finder"

export const isReviewExist = (productId: string, order: SingleOrder) => {
  const reviewRecords = metaFinder.safeParse<OrderReviewRecord[]>({
    metaData: order.metaData,
    key: "review_record",
  })

  if (!reviewRecords || reviewRecords.length === 0) return false

  return reviewRecords.some((r) => r.productId === +decodeBase64Id(productId))
}

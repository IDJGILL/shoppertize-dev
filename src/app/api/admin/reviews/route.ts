import { NextResponse, type NextRequest } from "next/server"
import { addBulkReviews } from "~/lib/modules/review/utils/review-apis"
import { type BulkReviewsSchemaProps } from "~/lib/modules/review/utils/review-schemas"

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as BulkReviewsSchemaProps

  const res = await addBulkReviews(body)

  return NextResponse.json(res)
}

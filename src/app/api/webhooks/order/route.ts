import { NextResponse, type NextRequest } from "next/server"
import { env } from "~/env.mjs"
import { placeOrderByWebhook } from "~/lib/modules/order/utils/order-apis"
import { base64 } from "~/lib/utils/functions/base64"

export const POST = async (req: NextRequest) => {
  const body = await (req.json() as Promise<{ response: string }>)

  const payload = base64.parse<PhonePePaymentStatus>({
    base64Id: body.response,
    index: 0,
  })

  await placeOrderByWebhook(payload)

  return NextResponse.json({ success: true })
}

export const GET = (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get("token")

  return NextResponse.redirect(
    env.NEXT_PUBLIC_FRONTEND_DOMAIN + "/order/confirmation?token=" + token,
  )
}

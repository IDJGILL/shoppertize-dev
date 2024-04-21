import { type NextRequest, NextResponse } from "next/server"
import { payment } from "~/lib/modules/payment/payment-methods"

export const POST = async (req: NextRequest) => {
  try {
    await payment.gateway.phonepe.validate(req)

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json({
      success: false,
    })
  }
}

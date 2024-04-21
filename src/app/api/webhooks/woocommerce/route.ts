import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { storeNavigations } from "~/lib/utils/constants/navigations"

export const runtime = "edge"

export const POST = async (req: NextRequest) => {
  const body = await (req.json() as Promise<{ productSlug: string }>)

  revalidatePath(storeNavigations.dynamic.product.path(body.productSlug))

  return NextResponse.json({ success: true })
}

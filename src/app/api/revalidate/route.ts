import { NextResponse, type NextRequest } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"
import {
  RevalidateSchema,
  type RevalidateSchemaProps,
} from "~/lib/server/api/store/product/product.dtos"
import { env } from "~/env.mjs"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await (request.json() as Promise<RevalidateSchemaProps>)

  const secret = request.headers.get("X-SECRET")

  if (!secret || secret !== env.REVALIDATION_SECRET) {
    return NextResponse.json({
      revalidation: false,
      message: "Invalid secret!",
    })
  }

  try {
    const data = await RevalidateSchema.parseAsync(json)

    data.forEach((a) => {
      if (a.type === "PATH") {
        a.items.forEach((b) => {
          revalidatePath(b)
        })

        return
      }

      a.items.forEach((b) => {
        revalidateTag(b)
      })
    })

    return NextResponse.json({
      revalidation: true,
      message: "Given item(s) revalidated successfully.",
    })
  } catch {
    return NextResponse.json({
      revalidation: false,
      message: "Incorrect payload.",
    })
  }
}

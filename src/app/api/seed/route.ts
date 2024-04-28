import { NextResponse } from "next/server"
import { seed } from "~/vertex/lib/utils/seed"

export const GET = async () => {
  const list = await seed()

  return NextResponse.json(list)
}

import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const json = (await request.json()) as unknown

  return NextResponse.json(true)
}

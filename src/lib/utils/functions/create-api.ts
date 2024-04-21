import { type NextRequest, NextResponse } from "next/server"
import { env } from "~/env.mjs"

export type CreateAuthedApi<TData> =
  | { status: false; message: string }
  | { status: true; data: TData }

export const createAuthedApi = async <TInput, TOutput>(
  req: NextRequest,
  callback: (props: TInput) => Promise<TOutput>,
) => {
  try {
    const json = (await req.json()) as TInput

    const secret = req.headers.get("X-SECRET")

    if (!!!secret || secret !== env.AUTH_SECRET) {
      return NextResponse.json({
        status: false,
        message: "You are not allowed to access this api without secret.",
      })
    }

    const data = await callback(json)

    return NextResponse.json({ status: true, data })
  } catch {
    return NextResponse.json({
      status: false,
      message: "Internal server error, please contact developer for help.",
    })
  }
}

export const authedApiClient = async <TInput, TOutput>(
  path: string,
  payload: TInput,
) => {
  const request = await fetch(env.NEXT_PUBLIC_FRONTEND_DOMAIN + "/api" + path, {
    headers: {
      "Content-Type": "application/json",
      "X-SECRET": env.AUTH_SECRET,
    },
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!request.ok) throw new Error()

  return (await request.json()) as TOutput
}

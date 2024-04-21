import { type HookCallbacks } from "next-safe-action/hooks"
import type { Schema, ZodTypeDef } from "zod"

export type ActionSuccess<TData> = {
  data: TData
  revalidatePaths?: string[]
  revalidateTags?: string[]
  message?: string
}

export type Status =
  | "SUCCESS"
  | "NOT_FOUND"
  | "PARSE_ERROR"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "UNPROCESSABLE_CONTENT"
  | "TOO_MANY_REQUESTS"
  | "CLIENT_CLOSED_REQUEST"

export type ClientActionError = { code: Status; message: string }

export type ActionCallBacks<T> = Omit<
  HookCallbacks<Schema<unknown, ZodTypeDef, unknown>, T>,
  "onError"
> & { onError?: (error: ClientActionError) => void }

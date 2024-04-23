import { type TRPCError } from "@trpc/server"
import { type HookCallbacks } from "next-safe-action/hooks"
import type { Schema, ZodTypeDef } from "zod"

export type ActionSuccess<TData> = {
  data: TData
  revalidatePaths?: string[]
  revalidateTags?: string[]
  message?: string
}

export type Status = TRPCError["code"]

export type ClientActionError = { code: Status; message: string }

export type ActionCallBacks<T> = Omit<HookCallbacks<Schema<unknown, ZodTypeDef, unknown>, T>, "onError"> & {
  onError?: (error: ClientActionError) => void
}

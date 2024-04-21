import "server-only"

import { createSafeActionClient } from "next-safe-action"
import type { Status, ActionSuccess } from "./types"
import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "../auth/config"
import { ExtendedError } from "~/vertex/utils/extended-error"

export const authAction = createSafeActionClient({
  middleware: async () => {
    const session = await auth()

    if (!session) {
      throw new ExtendedError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action.",
      })
    }

    return { session, response }
  },

  handleReturnedServerError: (e) => {
    if (e instanceof ExtendedError) {
      return JSON.stringify({ code: e.code, message: e.message })
    }

    return JSON.stringify({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error, Please try again.",
    })
  },
})

export const publicAction = createSafeActionClient({
  middleware: async () => {
    const session = await auth()

    console.log("SIGNUP")

    return { session, response }
  },

  handleReturnedServerError: (e) => {
    console.log(e)
    if (e instanceof ExtendedError) {
      return JSON.stringify({ code: e.code, message: e.message })
    }

    return JSON.stringify({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error, Please try again.",
    })
  },
})

const response = {
  success: <TData>(props: ActionSuccess<TData>) => {
    if (props.revalidatePaths) {
      props.revalidatePaths.forEach((path) => revalidatePath(path))
    }

    if (props.revalidateTags) {
      props.revalidateTags.forEach((tag) => revalidateTag(tag))
    }

    return {
      data: props.data,
    }
  },

  error: <TCode extends Status>(props: {
    code: TCode
    message?: string
    revalidatePaths?: string[]
    revalidateTags?: string[]
  }) => {
    if (props.revalidatePaths) {
      props.revalidatePaths.forEach((path) => revalidatePath(path))
    }

    if (props.revalidateTags) {
      props.revalidateTags.forEach((tag) => revalidateTag(tag))
    }

    throw new ExtendedError(props)
  },
}

import { createSafeActionClient } from "next-safe-action"
import type { Status, ActionSuccess } from "./server-types"
import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "../auth/auth-config"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import { type Revalidate } from "~/vertex/global/global-models"
import { cacheTagList, pathList } from "~/vertex/global/global-constants"

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

export const revalidate = (input: Revalidate) => {
  return new Promise<boolean>((resolve) => {
    const isPathExist = input.paths?.some((a) => pathList.includes(a))

    const isTagExist = input.tags?.some((a) => cacheTagList.includes(a))

    if (isPathExist) {
      input.paths?.forEach((path) => revalidatePath(path))
    }

    if (isTagExist) {
      input.tags?.forEach((tag) => revalidateTag(tag))
    }

    return resolve(true)
  })
}

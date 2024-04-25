import type { Schema, ZodTypeDef } from "zod"
import { type SafeAction } from "next-safe-action"
import { useAction } from "next-safe-action/hooks"
import type { ActionCallBacks, ClientActionError } from "./server-types"
import { type Revalidate } from "~/vertex/global/global-models"
import { revalidateAction } from "./server-actions"

export const useActionHandler = <T, K, F>(
  action: SafeAction<Schema<F, ZodTypeDef, K>, T>,
  callbacks?: ActionCallBacks<T>,
) => {
  const { result, status, execute } = useAction(action, {
    ...callbacks,
    onError: (e) => {
      if (!callbacks?.onError) return

      const error = JSON.parse(e.serverError ?? "") as ClientActionError

      callbacks.onError(error)
    },
  })

  const isLoading = status === "executing"

  const error = result.serverError ? (JSON.parse(result.serverError) as ClientActionError) : null

  return {
    status,
    isLoading,
    response: result,
    mutate: execute,
    error,
  }
}

export const useRevalidate = () => {
  const revalidate = useActionHandler(revalidateAction)

  return (props: Revalidate) => revalidate.mutate(props)
}

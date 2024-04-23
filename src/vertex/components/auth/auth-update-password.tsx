"use client"

import { useAuthContext } from "./auth-context"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { update } from "~/vertex/lib/action/actions"

export type AuthUpdatePasswordProps = ReturnType<typeof useAuthUpdatePassword>

interface Props {
  children: (p: AuthUpdatePasswordProps) => React.ReactNode
}

export function AuthUpdatePassword({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthUpdatePassword())}</>
}

export function useAuthUpdatePassword() {
  const { updatePasswordForm, redirect, actionSet } = useAuthContext()

  const updateAction = useActionHandler(update, {
    onSuccess: () => redirect(),

    onError: (error) => {
      if (error.code === "UNAUTHORIZED") actionSet("none")

      updatePasswordForm.setError("password", { message: error.message })
    },
  })

  const isLoading = updateAction.status === "executing"

  const mutate = updatePasswordForm.handleSubmit((a) => updateAction.mutate(a))

  const form = updatePasswordForm

  return {
    form,
    mutate,
    isLoading,
  }
}

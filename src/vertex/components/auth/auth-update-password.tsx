"use client"

import { useAuthContext } from "./auth-context"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { update } from "~/vertex/modules/auth/auth-actions"

export type AuthUpdatePasswordProps = ReturnType<typeof useAuthUpdatePassword>

interface Props {
  children: (p: AuthUpdatePasswordProps) => React.ReactNode
}

export function AuthUpdatePassword({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthUpdatePassword())}</>
}

export function useAuthUpdatePassword() {
  const { updatePasswordForm, redirect, actionSet, identifyForm } =
    useAuthContext()

  const updateAction = useActionHandler(update, {
    onSuccess: () => redirect(),

    onError: (error) => {
      if (error.code === "UNAUTHORIZED") {
        actionSet("none")

        identifyForm.setError("username", { message: error.message })

        return
      }

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

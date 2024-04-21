"use client"

import { useAuthContext } from "./auth-context"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { login } from "~/vertex/modules/auth/auth-actions"

export type AuthLoginProps = ReturnType<typeof useAuthLogin>

interface Props {
  children: (p: AuthLoginProps) => React.ReactNode
}

export function AuthLogin({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthLogin())}</>
}

export function useAuthLogin() {
  const { loginForm, redirect } = useAuthContext()

  const loginAction = useActionHandler(login, {
    onSuccess: () => redirect(),

    onError: (e) => {
      loginForm.setError("password", {
        message: e.message,
      })
    },
  })

  const mutate = loginForm.handleSubmit((input) => {
    loginAction.mutate(input)
  })

  const isLoading = loginAction.status === "executing"

  const form = loginForm

  return { form, mutate, isLoading }
}

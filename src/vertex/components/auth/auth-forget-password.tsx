"use client"

import { useAuthContext } from "./auth-context"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { forget } from "~/vertex/lib/action/actions"

export type AuthForgetPasswordProps = ReturnType<typeof useAuthForgetPassword>

interface Props {
  children: (p: AuthForgetPasswordProps) => React.ReactNode
}

export function AuthForgetPassword({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthForgetPassword())}</>
}

export function useAuthForgetPassword() {
  const { identifyForm, loginForm, actionSet, tokenSet } = useAuthContext()

  const forgetAction = useActionHandler(forget, {
    onSuccess: (response) => {
      actionSet("status-polling")
      tokenSet(response.id)
    },

    onError: (error) => {
      loginForm.setError("password", { message: error.message })
    },
  })

  const isLoading = forgetAction.status === "executing"

  const mutate = () => {
    forgetAction.mutate({ email: identifyForm.getValues("username") })
  }

  return {
    mutate,
    isLoading,
  }
}

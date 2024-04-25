"use client"

import { authSocialLoginAction } from "~/vertex/lib/server/server-actions"
import { useAuthContext } from "./auth-context"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { type Social } from "~/vertex/modules/auth/auth-models"

export type AuthSocialLoginProps = ReturnType<typeof useSocialLogin>

interface Props {
  children: (p: AuthSocialLoginProps) => React.ReactNode
}

export function AuthSocialLogin({ ...props }: Props) {
  const {} = props

  return <>{props.children(useSocialLogin())}</>
}

export function useSocialLogin() {
  const {} = useAuthContext()

  const socialLoginAction = useActionHandler(authSocialLoginAction)

  const isLoading = socialLoginAction.status === "executing"

  const mutate = (method: Social) => socialLoginAction.mutate(method)

  return {
    mutate,
    isLoading,
  }
}

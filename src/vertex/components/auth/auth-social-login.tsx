"use client"

import { useAuthContext } from "./auth-context"
import { socialLogin } from "~/vertex/lib/action/actions"
import { useActionHandler } from "~/vertex/lib/action/hook"
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

  const socialLoginAction = useActionHandler(socialLogin)

  const isLoading = socialLoginAction.status === "executing"

  const mutate = (method: Social) => socialLoginAction.mutate(method)

  return {
    mutate,
    isLoading,
  }
}

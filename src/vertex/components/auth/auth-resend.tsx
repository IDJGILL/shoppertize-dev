"use client"

import { useCountDown } from "~/vertex/hooks/useCountdown"
import { useAuthContext } from "./auth-context"
import { useUpdateEffect } from "react-use"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { authResendAction } from "~/vertex/lib/server/server-actions"
import { atom } from "jotai"

export type AuthResendProps = ReturnType<typeof useAuthResend>

interface Props {
  children: (p: AuthResendProps) => React.ReactNode
}

export function AuthResend({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthResend())}</>
}

export const authCountdownAtom = atom(60)

export function useAuthResend() {
  const { identifyForm, otpForm, resetFormsState, token } = useAuthContext()

  const countdown = useCountDown(authCountdownAtom)

  const resendAction = useActionHandler(authResendAction, {
    onError: (response) => {
      switch (response.code) {
        // Session Expired
        case "UNAUTHORIZED": {
          identifyForm.setError("username", { message: response.message })

          resetFormsState()

          break
        }

        // Maximum limit reached
        case "TOO_MANY_REQUESTS": {
          identifyForm.setError("username", { message: response.message })

          resetFormsState()

          break
        }

        case "CONFLICT": {
          otpForm.setError("value", { message: response.message })
        }
      }
    },
  })

  const isLoading = resendAction.status === "executing"

  useUpdateEffect(() => countdown.reset(60), [isLoading])

  const mutate = () => {
    resendAction.mutate({
      id: otpForm.getValues("id") ?? token,
    })
  }

  return {
    mutate,
    isLoading,
    countdown,
  }
}

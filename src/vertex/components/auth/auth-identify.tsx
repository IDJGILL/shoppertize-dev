"use client"

import { useAuthContext } from "./auth-context"
import { identify } from "~/vertex/modules/auth/auth-actions"
import { useActionHandler } from "~/vertex/lib/action/hook"

export type AuthIdentifyProps = ReturnType<typeof useAuthIdentify>

interface Props {
  children: (p: AuthIdentifyProps) => React.ReactNode
}

export function AuthIdentify({ ...props }: Props) {
  return <>{props.children(useAuthIdentify())}</>
}

export function useAuthIdentify() {
  const { identifyForm, loginForm, actionSet, otpForm, tokenSet, updateId } = useAuthContext()

  const identifyAction = useActionHandler(identify, {
    onSuccess: (data) => {
      const input = identifyForm.getValues()

      switch (data.action) {
        case "login": {
          if (data.verification === "otp") {
            otpForm.setValue("id", data.id)

            actionSet("otp")

            break
          }

          loginForm.setValue("username", input.username)

          actionSet(data.action)

          break
        }

        case "signup": {
          if (data.verification === "otp") {
            updateId(data.id)

            actionSet("otp")

            break
          }

          tokenSet(data.id)

          actionSet("status-polling")

          break
        }
      }
    },

    onError: (error) => {
      identifyForm.setError("username", { message: error.message })
    },
  })

  const mutate = identifyForm.handleSubmit((a) => {
    identifyAction.mutate(a)
  })

  const isLoading = identifyAction.status === "executing"

  const form = identifyForm

  return {
    form,
    mutate,
    isLoading,
  }
}

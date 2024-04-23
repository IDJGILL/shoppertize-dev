"use client"

import { useAuthContext } from "./auth-context"
import { verify } from "~/vertex/lib/action/actions"
import { useActionHandler } from "~/vertex/lib/action/hook"

export type AuthOneTimePassCodeProps = ReturnType<typeof useAuthOtp>

interface Props {
  children: (p: AuthOneTimePassCodeProps) => React.ReactNode
}

export function AuthOneTimePassCode({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthOtp())}</>
}

export function useAuthOtp() {
  const { identifyForm, otpForm, redirect, actionSet, resetFormsState, router } = useAuthContext()

  const verifyAction = useActionHandler(verify, {
    onSuccess: (response) => {
      switch (response.action) {
        case "signup": {
          if (response.verification === "otp") redirect()

          actionSet(response.action)

          break
        }

        case "login": {
          redirect()
        }
      }
    },

    onError: (error) => {
      switch (error.code) {
        // Session Expired
        case "UNAUTHORIZED": {
          identifyForm.setError("username", { message: error.message })

          resetFormsState()

          router.push("/login")

          break
        }

        // Otp Expired
        case "TIMEOUT": {
          otpForm.setError("value", { message: error.message })

          break
        }

        // Maximum limit reached
        case "TOO_MANY_REQUESTS": {
          identifyForm.setError("username", { message: error.message })

          resetFormsState()

          break
        }

        // Otp did not match
        case "BAD_REQUEST": {
          otpForm.setError("value", { message: error.message })

          break
        }
      }
    },
  })

  const mutate = otpForm.handleSubmit((a) => {
    verifyAction.mutate(a)
  })

  const isLoading = verifyAction.status === "executing"

  const form = otpForm

  return {
    form,
    mutate,
    isLoading,
  }
}

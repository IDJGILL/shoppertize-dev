"use client"

import { useAuthContext } from "~/vertex/components/auth/auth-context"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { signup } from "~/vertex/modules/auth/auth-actions"

export type AuthSignupProps = ReturnType<typeof useAuthSignup>

interface Props {
  children: (p: AuthSignupProps) => React.ReactNode
}

export function AuthSignup({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthSignup())}</>
}

export function useAuthSignup() {
  const { identifyForm, signupForm, redirect, resetFormsState } =
    useAuthContext()

  const signupAction = useActionHandler(signup, {
    onSuccess: () => redirect(),

    onError: (error) => {
      switch (error.code) {
        case "UNAUTHORIZED": {
          identifyForm.setError("username", { message: error.message })

          resetFormsState()

          break
        }

        default: {
          signupForm.setError("password", { message: error.message })
        }
      }
    },
  })

  const mutate = signupForm.handleSubmit((a) => {
    signupAction.mutate(a)
  })

  const isLoading = signupAction.status === "executing"

  const form = signupForm

  return { form, mutate, isLoading }
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { createContext, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useMount, useUpdateEffect } from "react-use"
import {
  $Login,
  $Verify,
  $Identify,
  $Signup,
  $UpdatePassword,
  type Verify,
  type Identify,
  type Login,
  type Signup,
  type UpdatePassword,
} from "~/vertex/modules/auth/auth-models"
import { type AuthenticationAction } from "~/vertex/modules/auth/auth-types"

const AuthContext = createContext<ReturnType<typeof AuthContextLogic> | null>(null)

function AuthContextLogic() {
  const [token, tokenSet] = useState<string | null>(null)
  const [action, actionSet] = useState<AuthenticationAction>("none")
  const [isMounted, isMountedSet] = useState(false)

  useMount(() => isMountedSet(true))

  const searchParams = useSearchParams()

  const router = useRouter()

  const isVerify = !!searchParams.get("verify")

  const identifyForm = useForm<Identify>({
    resolver: zodResolver($Identify),
  })

  const otpForm = useForm<Verify>({
    resolver: zodResolver($Verify),
  })

  const loginForm = useForm<Login>({
    resolver: zodResolver($Login),
  })

  const signupForm = useForm<Signup>({
    resolver: zodResolver($Signup),
  })

  const updatePasswordForm = useForm<UpdatePassword>({
    resolver: zodResolver($UpdatePassword),
  })

  function resetFormsState() {
    otpForm.reset()
    loginForm.reset()
    signupForm.reset()
    updatePasswordForm.reset()
    actionSet("none")
    tokenSet(null)
  }

  function updateId(id: string) {
    signupForm.setValue("id", id)
    updatePasswordForm.setValue("id", id)
    otpForm.setValue("id", id)
  }

  const redirect = () => {
    window.location.href = searchParams.get("callbackUrl") ?? "/"
  }

  useUpdateEffect(() => {
    if (isVerify) actionSet("verify")
  }, [isVerify, isMounted])

  return {
    updateId,
    action,
    identifyForm,
    actionSet,
    loginForm,
    signupForm,
    otpForm,
    redirect,
    tokenSet,
    resetFormsState,
    token,
    router,
    searchParams,
    isMounted,
    isVerify,
    updatePasswordForm,
  }
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("Please wrap useAuthContext in AuthContextProvider.")
  }

  return context
}

interface AuthContextProps extends React.HTMLAttributes<HTMLElement> {}

export function AuthContextProvider({ ...props }: AuthContextProps) {
  const {} = props

  return <AuthContext.Provider value={AuthContextLogic()}>{props.children}</AuthContext.Provider>
}

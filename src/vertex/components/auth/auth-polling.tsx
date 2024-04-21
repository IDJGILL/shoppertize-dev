"use client"

import { useAuthContext } from "./auth-context"
import { authStatus } from "~/vertex/modules/auth/auth-actions"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"
import { useUpdateEffect } from "react-use"

export type AuthPollingProps = ReturnType<typeof useAuthPolling>

interface Props {
  children: (p: AuthPollingProps) => React.ReactNode
}

export function AuthPolling({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthPolling())}</>
}

export function useAuthPolling() {
  const { tokenSet, token, actionSet, redirect, identifyForm, resetFormsState, updateId } = useAuthContext()

  const pingAuthStatus = useQuery({
    queryKey: ["auth-polling"],

    queryFn: async () => {
      const response = await authStatus({ id: token ?? "" })

      console.log("Polling...")

      if (response.serverError) return tokenSet(null)

      if (!response.data || !response.data.isVerified) return null

      if (response.data.action === "login") return redirect()

      updateId(response.data.id)

      actionSet(response.data.action)

      return response.data
    },

    refetchInterval: 2000,

    enabled: !!token,
  })

  const isLoading = pingAuthStatus.isLoading

  const pingErrorHandler = useCallback(() => {
    if (!pingAuthStatus.isError) return

    identifyForm.setError("username", {
      message: pingAuthStatus.error.message,
    })

    resetFormsState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingAuthStatus.isError])

  useUpdateEffect(() => pingErrorHandler(), [pingAuthStatus.isError])

  return {
    isLoading,
  }
}

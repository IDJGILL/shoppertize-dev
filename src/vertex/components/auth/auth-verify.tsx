"use client"

import { base64 } from "~/lib/utils/functions/base64"
import { useAuthContext } from "./auth-context"
import { useCallback, useEffect } from "react"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { verify } from "~/vertex/modules/auth/auth-actions"

export type AuthVerifyProps = ReturnType<typeof useAuthVerify>

interface Props {
  verify: "manual" | "auto"
  children: (p: AuthVerifyProps) => React.ReactNode
}

export function AuthVerify({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthVerify(props.verify))}</>
}

export function useAuthVerify(verifyType: "manual" | "auto") {
  const { searchParams, tokenSet, actionSet, redirect, router, updateId } = useAuthContext()

  const verifyToken = searchParams.get("verify")

  const verifyAction = useActionHandler(verify, {
    onSuccess: (response) => {
      if (!response.sameDevice) return

      if (response.action === "login") return redirect()

      router.push("/login")

      updateId(response.id)

      actionSet(response.action)
    },

    onError: () => {
      actionSet("verify")
    },
  })

  const mutate = useCallback(() => {
    if (!verifyToken || verifyType === "manual") return

    const decoded = decodeVerifyToken(verifyToken)

    if (!decoded) return

    tokenSet(decoded.id)

    verifyAction.mutate({ id: decoded.id, value: decoded.secret })
  }, [tokenSet, verifyAction, verifyToken, verifyType])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mutate(), [verifyToken])

  function decodeVerifyToken(token: string) {
    const encodedId = decodeURIComponent(token)

    const id = base64.safeParse<string>({
      base64Id: encodedId ?? "",
      index: 0,
    })

    const secret = base64.safeParse<string>({
      base64Id: encodedId ?? "",
      index: 1,
    })

    if (!id || !secret) return null

    return { id, secret }
  }

  const isLoading = verifyAction.status === "executing"

  const message = verifyAction.response.data?.message ?? verifyAction.error?.message ?? "Verifying..."

  return { mutate, isLoading, message }
}

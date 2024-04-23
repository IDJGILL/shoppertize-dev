"use client"

import { logout } from "~/vertex/lib/action/actions"
import { useActionHandler } from "~/vertex/lib/action/hook"

export type AuthLogoutProps = ReturnType<typeof useAuthLogout>

interface Props {
  children: (p: AuthLogoutProps) => React.ReactNode
}

export function AuthLogout({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAuthLogout())}</>
}

export function useAuthLogout() {
  const logoutAction = useActionHandler(logout, {
    onSuccess: () => {
      window.location.href = "/"
    },
  })

  const isLoading = logoutAction.status === "executing"

  const mutate = () => logoutAction.mutate(undefined)

  return {
    mutate,
    isLoading,
  }
}

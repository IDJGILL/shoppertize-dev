"use client"

import { createContext, useContext } from "react"
import type { AuthClientSession } from "~/vertex/global/global-types"
import { api } from "~/vertex/lib/trpc/trpc-context-provider"

const AuthSessionContext = createContext<AuthClientSession | null>(null)

interface AuthSessionProviderProps extends React.HTMLAttributes<HTMLElement> {}

export function AuthSessionProvider({ ...props }: AuthSessionProviderProps) {
  const {} = props

  return <AuthSessionContext.Provider value={AuthContextLogic()}>{props.children}</AuthSessionContext.Provider>
}

function AuthContextLogic() {
  const { data, isLoading } = api.vertexAuth.session.useQuery()

  return {
    user: data,
    isLoading,
    isLoggedIn: !!data,
  }
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error("Wrap useAuthSession inside AuthSessionProvider")
  }

  return context
}

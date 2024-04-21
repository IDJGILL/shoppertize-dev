import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { AuthContextProvider } from "./auth-context"

interface AuthProviderProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: React.ReactNode
}

export function AuthProvider({ ...props }: AuthProviderProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={props.loader}>
        <InitialDataFetcher>{props.children}</InitialDataFetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

interface InitialCartDataFetcherProps {
  children: React.ReactNode
}

function InitialDataFetcher({ ...props }: InitialCartDataFetcherProps) {
  const {} = props

  return <AuthContextProvider>{props.children}</AuthContextProvider>
}

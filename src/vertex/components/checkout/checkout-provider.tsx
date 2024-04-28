import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { CheckoutContextProvider } from "./checkout-context"
import { checkoutSessionQuery } from "~/vertex/modules/checkout/checkout-queries"
import { safeAsync } from "~/vertex/lib/utils/safe-async"
import { permanentRedirect } from "next/navigation"

interface CheckoutProviderProps extends React.HTMLAttributes<HTMLElement> {
  error: React.ReactElement
  loader: React.ReactElement
}

export function CheckoutProvider({ ...props }: CheckoutProviderProps) {
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

async function InitialDataFetcher({ ...props }: InitialCartDataFetcherProps) {
  const {} = props

  const data = await safeAsync(checkoutSessionQuery)

  if (!data) return permanentRedirect("/cart")

  return <CheckoutContextProvider data={data}>{props.children}</CheckoutContextProvider>
}

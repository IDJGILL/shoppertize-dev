import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { getCartData } from "~/vertex/modules/cart/cart-actions"
import { CartContextProvider } from "./context"

interface CartContextProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: React.ReactNode
}

export function CartContext({ ...props }: CartContextProps) {
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

  const data = await getCartData()

  return <CartContextProvider data={data}>{props.children}</CartContextProvider>
}

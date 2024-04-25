import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { CartContextProvider } from "./cart-context"
import { getCart } from "~/vertex/modules/cart/cart-controllers"
import AppLoader from "../app/app-loader"

interface CartContextProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: React.ReactNode
}

export function CartContext({ ...props }: CartContextProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={<AppLoader />}>
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

  const data = await getCart()

  return <CartContextProvider data={data}>{props.children}</CartContextProvider>
}

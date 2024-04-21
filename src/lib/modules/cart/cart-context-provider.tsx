import { ErrorBoundary } from "react-error-boundary"
import { CartClientContext } from "./cart-context"
import { Suspense } from "react"
import { caller } from "~/lib/trpc/trpc-caller"
import CartEmptyScreen from "~/app/(checkout)/cart/_components/cart-empty-screen"

interface CartContextProviderProps extends React.HTMLAttributes<HTMLElement> {}

export default function CartContextProvider({
  ...props
}: CartContextProviderProps) {
  const {} = props

  return (
    <div className="h-screen">
      <ErrorBoundary FallbackComponent={CartEmptyScreen}>
        <Suspense fallback={"loading..."}>
          <InitialDataFetcher>{props.children}</InitialDataFetcher>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

interface InitialDataFetcherProps extends React.HTMLAttributes<HTMLElement> {}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const {} = props

  console.log("Fetching...")

  const data = await caller.cart.get()

  return <CartClientContext data={data}>{props.children}</CartClientContext>
}

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { getCartItemsCount } from "~/vertex/modules/cart/cart-actions"

interface CartCountProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: (props: { count: number }) => React.ReactNode
}

/**
 * Lets you display current cart items count from either cookie store or user database.
 *
 * @requires ServerComponent
 *
 * @example
 * import { CartCount } from "~/vertex/components/cart/CartCount"
 *
 * <CartCount>{({ count }) => <div>{count}</div>}</CartCount>
 */
export function CartCount({ ...props }: CartCountProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={props.loader}>
        <InitialDataFetcher>
          {({ count }) => props.children({ count })}
        </InitialDataFetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

interface InitialDataFetcherProps {
  children: (props: { count: number }) => React.ReactNode
}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const {} = props

  const count = await getCartItemsCount()

  return <>{props.children({ count })}</>
}

import { ErrorBoundary } from "react-error-boundary"
import { Suspense, type ReactElement } from "react"
import { AddToCartContextProvider } from "./adtc-context"
import { getCachedProductStock } from "~/vertex/modules/cart/cart-server-utils"

interface AddToCartProps extends React.HTMLAttributes<HTMLElement> {
  error: ReactElement
  loader: ReactElement
  productId: string
}

/**
 * Let's you add product to the cart
 * 
 * @requires ServerComponent
 * 
 * @example
 * import { AddToCart } from "~/vertex/components/cart/AddToCart"
 * 
 * <AddToCart
      productId={product.id as string}
        error={<div>Something went wrong</div>}
        loader={
          <div className="flex-1">
            <Skeleton className="min-h-[44px] w-full" />
          </div>
        }
      >
        <AddToCartButton />
  </AddToCart>
 */
export function AddToCart({ ...props }: AddToCartProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={props.loader}>
        <InitialDataFetcher productId={props.productId}>{props.children}</InitialDataFetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

interface InitialDataFetcherProps extends React.HTMLAttributes<HTMLElement> {
  productId: string
}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const { productId } = props

  const product = await getCachedProductStock(productId)

  if (!product) throw new Error("Product not found")

  return <AddToCartContextProvider initialData={product}>{props.children}</AddToCartContextProvider>
}

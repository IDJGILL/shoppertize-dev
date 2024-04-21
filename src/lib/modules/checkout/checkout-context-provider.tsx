import { redirect } from "next/navigation"
import { auth } from "../auth/auth-config"
import { CheckoutContextClient } from "./checkout-context"
import { checkout } from "./checkout-methods"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface CheckoutContextProviderProps
  extends React.HTMLAttributes<HTMLElement> {}

export default function CheckoutContextProvider({
  ...props
}: CheckoutContextProviderProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={"loading..."}>
        <Fetcher>{props.children}</Fetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

async function fetchData() {
  try {
    const session = await auth()

    const data = await checkout.get({ session: session! })

    return data
  } catch {
    return null
  }
}

interface FetcherProps extends React.HTMLAttributes<HTMLElement> {}

async function Fetcher({ ...props }: FetcherProps) {
  const {} = props

  const data = await fetchData()

  if (!data) redirect("/cart")

  return (
    <CheckoutContextClient data={data}>{props.children}</CheckoutContextClient>
  )
}

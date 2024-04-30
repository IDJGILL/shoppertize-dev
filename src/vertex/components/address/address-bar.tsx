import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { queryCurrentAddress, queryPostcodeServiceability } from "~/vertex/lib/server/server-queries"
import type { Shipping } from "~/vertex/modules/address/address-models"
import { type Serviceability } from "~/vertex/modules/courier/courier-types"

type Payload = {
  serviceability: Serviceability | null
  address: Shipping | null
  hasSelectedAddress: boolean
}

interface AddressBarProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: (props: Payload) => React.ReactNode
}

export function AddressBar({ ...props }: AddressBarProps) {
  const {} = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={props.loader}>
        <InitialDataFetcher>{(data) => props.children(data)}</InitialDataFetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

interface InitialDataFetcherProps {
  children: (props: Payload) => React.ReactNode
}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const {} = props

  const [serviceability, address] = await Promise.all([queryPostcodeServiceability(), queryCurrentAddress()])

  const hasSelectedAddress = !!address

  return <> {props.children({ serviceability, address: address ?? null, hasSelectedAddress })}</>
}

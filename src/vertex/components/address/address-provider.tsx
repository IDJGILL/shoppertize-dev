import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { AddressContextProvider } from "./address-context"
import AppLoader from "../app/app-loader"
import { getAddressById } from "~/vertex/modules/address/address-queries"

interface AddressProviderProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: React.ReactNode
  addressId?: string
}

export function AddressProvider({ ...props }: AddressProviderProps) {
  const { addressId } = props

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={<AppLoader />}>
        <InitialDataFetcher addressId={addressId}>{props.children}</InitialDataFetcher>
      </Suspense>
    </ErrorBoundary>
  )
}

interface InitialCartDataFetcherProps {
  children: React.ReactNode
  addressId?: string
}

async function InitialDataFetcher({ ...props }: InitialCartDataFetcherProps) {
  const { addressId } = props

  const data = await getAddressById(addressId).catch(() => null)

  return <AddressContextProvider data={data}>{props.children}</AddressContextProvider>
}

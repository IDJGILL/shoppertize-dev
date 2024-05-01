import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import AppLoader from "../app/app-loader"
import { queryAddressById } from "~/vertex/lib/server/server-queries"
import { AddressFormContext } from "./address-form-context"

interface AddressFormBuilderProps {
  addressId?: string
  error: React.ReactElement
  loader: React.ReactElement
  children: React.ReactNode
}

export function AddressFormBuilder({ ...props }: AddressFormBuilderProps) {
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

  const data = await queryAddressById(addressId ?? "")

  return <AddressFormContext initial={data}>{props.children}</AddressFormContext>
}

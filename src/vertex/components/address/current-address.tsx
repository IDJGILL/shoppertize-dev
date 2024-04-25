import { Suspense } from "react"
import { getCurrentAddress } from "~/vertex/modules/address/address-queries"
import { type AddressData } from "~/vertex/modules/address/address-types"

interface CurrentAddressProps {
  children: (props: { address: AddressData | null }) => React.ReactNode
}

export default function CurrentAddress({ ...props }: CurrentAddressProps) {
  const {} = props

  return (
    <Suspense fallback="Loading Address...">
      <InitialDataFetcher>{(data) => props.children({ address: data.address })}</InitialDataFetcher>
    </Suspense>
  )
}

interface InitialDataFetcherProps {
  children: (props: { address: AddressData | null }) => React.ReactNode
}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const {} = props

  const address = await getCurrentAddress(undefined)

  return <>{props.children({ address })}</>
}

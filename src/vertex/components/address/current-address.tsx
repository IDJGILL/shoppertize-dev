import { Suspense } from "react"
import { type AddressData } from "~/vertex/modules/address/address-types"
import { getCurrentAddress } from "~/vertex/modules/cart/cart-controllers"

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

  const address = await getCurrentAddress()

  return <>{props.children({ address })}</>
}

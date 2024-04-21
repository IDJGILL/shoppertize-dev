import { Suspense } from "react"
import { auth } from "~/lib/modules/auth/auth-config"
import { getCurrentAddress } from "~/vertex/modules/address/address-actions"
import { type AddressDataItem } from "~/vertex/modules/address/address-types"

interface CurrentAddressProps {
  children: (props: { address: AddressDataItem | null }) => React.ReactNode
}

export default function CurrentAddress({ ...props }: CurrentAddressProps) {
  const {} = props

  return (
    <Suspense fallback="Loading Address...">
      <InitialDataFetcher>
        {(data) => props.children({ address: data.address })}
      </InitialDataFetcher>
    </Suspense>
  )
}

interface InitialDataFetcherProps {
  children: (props: { address: AddressDataItem | null }) => React.ReactNode
}

async function InitialDataFetcher({ ...props }: InitialDataFetcherProps) {
  const {} = props

  const session = await auth()

  if (!session) {
    return <>{props.children({ address: null })}</>
  }

  const address = await getCurrentAddress(+session.user.id)

  return <>{props.children({ address })}</>
}

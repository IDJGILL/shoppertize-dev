import AddressForm from "~/app/(checkout)/checkout/address/_components/address-form"
import { AddressProvider } from "~/vertex/components/address/address-provider"

export default function AddressPage(props: ServerComponentParams) {
  const addressId = props.searchParams?.aid as string | undefined

  return (
    <AddressProvider addressId={addressId} loader={<div>Loading...</div>} error={<div>Something went wrong</div>}>
      <AddressForm />
    </AddressProvider>
  )
}

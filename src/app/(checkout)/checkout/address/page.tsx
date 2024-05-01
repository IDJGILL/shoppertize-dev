import AddressForm from "~/app/(checkout)/checkout/address/_components/address-form"
import { AddressFormBuilder } from "~/vertex/components/address/address-form-builder"
import AppLoader from "~/vertex/components/app/app-loader"

export default function AddressPage(props: ServerComponentParams) {
  const addressId = props.searchParams?.aid as string | undefined

  return (
    <AddressFormBuilder addressId={addressId} loader={<AppLoader />} error={<div></div>}>
      <AddressForm />
    </AddressFormBuilder>
  )
}

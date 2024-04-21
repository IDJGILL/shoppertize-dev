import AddressContainer from "./_components/address-container"
import { AddressContextProvider } from "~/lib/modules/address/components/address-context"

export default function AddressPage() {
  return (
    <AddressContextProvider>
      <AddressContainer />
    </AddressContextProvider>
  )
}

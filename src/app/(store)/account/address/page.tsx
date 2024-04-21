import React, { Suspense } from "react"
import AccountSectionWrapper from "../_components/account-section-wrapper"
import AddressPreview from "./_components/address-preview"
import LoaderFallBack from "~/app/_components/loader-fallback"

export default function AddressPage() {
  return (
    <AccountSectionWrapper
      title="My Address"
      sub="Add, edit and updated address"
      className="max-w-2xl"
    >
      <Suspense fallback={<LoaderFallBack className="h-[200px]" />}>
        <AddressPreview />
      </Suspense>
    </AccountSectionWrapper>
  )
}

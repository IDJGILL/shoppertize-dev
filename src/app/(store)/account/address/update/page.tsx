"use client"

import React from "react"
import AccountSectionWrapper from "../../_components/account-section-wrapper"
import AddressForm from "~/app/(checkout)/checkout/address/_components/address-form"
import AddressContextProvider from "~/lib/modules/address/components/address-context-backup"
import { api } from "~/lib/server/access/client"
import LoaderFallBack from "~/app/_components/loader-fallback"

export default function UpdateAddressPage() {
  const { data, isLoading, isFetching } = api.store.address.getAddress.useQuery(undefined, {
    refetchOnMount: true,
  })

  if (isLoading || isFetching) return <LoaderFallBack />

  return (
    <AccountSectionWrapper
      title="Update Address"
      sub="Add, edit and updated address"
      className="max-w-4xl rounded-xl bg-white pb-4"
    >
      <AddressContextProvider initialData={data}>
        <AddressForm />
      </AddressContextProvider>
    </AccountSectionWrapper>
  )
}

"use client"

import React from "react"
import AccountSectionWrapper from "../_components/account-section-wrapper"
import { api } from "~/lib/server/access/client"
import OrdersList from "./_components/orders-list"
import LoaderFallBack from "~/app/_components/loader-fallback"

export default function OrdersPage() {
  const { data, isLoading } = api.store.order.getInfiniteOrders.useQuery({
    limit: 10,
  })

  return (
    <AccountSectionWrapper
      title="My Orders"
      sub="View, track and add reviews"
      className="max-w-2xl"
    >
      {isLoading && <LoaderFallBack />}
      <OrdersList orders={data?.data ?? []} />
    </AccountSectionWrapper>
  )
}

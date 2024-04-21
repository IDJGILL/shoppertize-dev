import { redirect } from "next/navigation"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import LoaderFallBack from "~/app/_components/loader-fallback"
import SingleOrderRSC from "~/lib/ui/account/orders/single/single-order-rsc"

export default function SingleOrderPage(props: ServerComponentParams) {
  const id = props.params.id

  if (!id) return redirect("/404")

  return (
    <ErrorBoundary fallback={<div></div>}>
      <Suspense fallback={<LoaderFallBack />}>
        <SingleOrderRSC id={id} />
      </Suspense>
    </ErrorBoundary>
  )
}

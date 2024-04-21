import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import LoaderFallBack from "~/app/_components/loader-fallback"
import WalletRSC from "~/lib/ui/account/wallet/wallet-rsc"

export const dynamic = "force-dynamic"

export default function WalletPage() {
  return (
    <ErrorBoundary fallback={<div></div>}>
      <Suspense fallback={<LoaderFallBack />}>
        <WalletRSC />
      </Suspense>
    </ErrorBoundary>
  )
}

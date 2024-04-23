import React from "react"
import { CheckoutProvider } from "~/vertex/components/checkout/checkout-provider"
import CheckoutWrapper from "../_components/checkout-wrapper"
import PaymentSection from "../_components/sections/payment-section"
import AddressSection from "../_components/sections/address-section"
import SummarySection from "../_components/sections/summary-section"
import CheckoutFooter from "../_components/checkout-footer"

export default function CheckoutPage() {
  return (
    <CheckoutProvider loader={<div>Loading...</div>} error={<div>Something went wrong</div>}>
      <CheckoutWrapper
        left={<div className="space-y-4">{/* <PaymentSection /> */}</div>}
        right={
          <div className="space-y-4">
            {/* <AddressSection />
            <SummarySection /> */}
            {/* <CheckoutFooter /> */}

            {/*  */}
            {/* <ApplyCoupon sortedCoupon={coupons} summary={summary} /> */}
            {/* <TrustBadges className="pb-20 md:pb-0" /> */}
          </div>
        }
      />
    </CheckoutProvider>
  )
}

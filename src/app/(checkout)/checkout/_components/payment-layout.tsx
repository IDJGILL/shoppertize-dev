import CheckoutContextProvider from "~/lib/modules/checkout/checkout-context-provider"
import CheckoutWrapper from "../_components/checkout-wrapper"
import PaymentSection from "../_components/sections/payment-section"
import SummarySection from "../_components/sections/summary-section"
import AddressSection from "../_components/sections/address-section"
import CheckoutFooter from "../_components/checkout-footer"
// import { useCheckoutContext } from "~/lib/modules/checkout/components/checkout-context-bk"
// import ApplyCoupon from "~/lib/modules/coupon/components/apply-coupon"

interface PaymentLayoutProps extends React.HTMLAttributes<HTMLElement> {}

export default function PaymentLayout({ ...props }: PaymentLayoutProps) {
  const {} = props

  return (
    <CheckoutContextProvider>
      <CheckoutWrapper
        left={
          <div className="space-y-4">
            <PaymentSection />
          </div>
        }
        right={
          <div className="space-y-4">
            {/* <ApplyCoupon sortedCoupon={coupons} summary={summary} /> */}
            <AddressSection />
            <SummarySection />
            {/* <TrustBadges className="pb-20 md:pb-0" /> */}
            <CheckoutFooter />
          </div>
        }
      />
    </CheckoutContextProvider>
  )
}

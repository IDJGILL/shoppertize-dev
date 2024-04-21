import PaymentBadges from "../payment-badges"

export default function SimpleFooter() {
  return (
    <div className="border-t py-4">
      <div className="container flex items-center justify-between">
        <PaymentBadges className="max-w-sm" />

        <div className="text-sm text-muted-foreground">
          © 2021 Shoppertize. All Rights Reserved.
        </div>
      </div>
    </div>
  )
}

import CheckoutHeader from "./checkout/_components/header/checkout-header"
import SimpleFooter from "~/app/_components/footer/simple-footer"

export const dynamic = "force-dynamic"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-slate-100">
      <CheckoutHeader />

      {children}

      <SimpleFooter />
    </main>
  )
}

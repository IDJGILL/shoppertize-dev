import BrandLogo from "~/app/_components/brand-logo"
import HeaderBackNavigator from "~/app/_components/header/header-back-navigator"
import SecureBadge from "../shared/secure-badge"

interface CheckoutHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export default function CheckoutHeader({ ...props }: CheckoutHeaderProps) {
  const {} = props

  return (
    <header className="sticky inset-x-0 top-0 z-[1000000] border-b bg-white">
      <div className="container grid h-14 grid-cols-2 justify-between pl-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-center gap-4">
            <HeaderBackNavigator title="Checkout" />

            <BrandLogo />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <SecureBadge className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  )
}

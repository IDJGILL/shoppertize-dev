import Link from "next/link"
import { Suspense } from "react"
import {
  accountNavigations,
  authNavigations,
  storeNavigations,
} from "~/lib/utils/constants/navigations"
import { ErrorBoundary } from "react-error-boundary"
import CartHandler from "../cart/cart-handler"

// interface DevNavigationsProps extends React.HTMLAttributes<HTMLElement> {}

export default function DevNavigations() {
  return (
    <div className="sticky inset-x-0 top-0 border-b bg-white p-4 shadow-sm">
      <div className="mx-auto max-w-max text-sm">
        <Link href="/home" className="px-4">
          Home
        </Link>

        <Link href="https://4r9tl1g1-3000.inc1.devtunnels.ms" className="px-4">
          Live
        </Link>

        <Link
          href={storeNavigations.dynamic.shop.path("home-kitchen")}
          className="px-4"
        >
          Shop
        </Link>

        {Object.entries(authNavigations.static).map(([key, value]) => (
          <Link key={key} href={value.path} className="px-4">
            {value.label()}
          </Link>
        ))}

        {Object.entries(accountNavigations.static).map(([key, value]) => (
          <Link key={key} href={value.path} className="px-4">
            {value.label()}
          </Link>
        ))}

        {Object.entries(storeNavigations.static).map(([key, value]) => (
          <Link key={key} href={value.path} className="px-4">
            {value.label()}
          </Link>
        ))}

        <Link href="https://4r9tl1g1-3000.inc1.devtunnels.ms" className="px-4">
          Cart:{" "}
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <CartHandler />
            </Suspense>
          </ErrorBoundary>
        </Link>
      </div>
    </div>
  )
}

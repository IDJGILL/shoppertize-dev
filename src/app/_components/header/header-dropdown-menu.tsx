"use client"

import { ShoppingCart, UserIcon } from "lucide-react"
import Link from "next/link"
import { AccountMenuLinks, MenuHeader } from "./header-navigation-links"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import SearchTrigger from "./search-trigger"
import WishlistIcon from "./wishlist-icon"
import { useAuthSession } from "~/vertex/components/auth/auth-session-context"

export default function HeaderDropDownMenu() {
  const session = useAuthSession()

  return (
    <div className="flex h-full items-center justify-end">
      <div className="flex h-full max-w-max items-center justify-center gap-4 md:gap-8">
        <SearchTrigger />

        {/* Desktop User */}
        <div className="group relative hidden h-full flex-col items-center justify-center py-2 md:flex">
          <div className="flex h-full cursor-pointer items-center group-hover:text-secondary">
            <UserIcon className="w-[22px] md:w-5" />
          </div>

          {/* Dropdown */}
          <div className="invisible absolute -right-1/2 top-7 z-[100000] w-[200px] translate-x-[calc(50%-16px)] transform group-hover:visible">
            <div className="relative mt-8 overflow-hidden rounded border bg-white shadow">
              <div className="pb-4">
                <MenuHeader session={session} />

                <AccountMenuLinks session={session} />
              </div>
            </div>
          </div>
        </div>

        <WishlistIcon />

        <Link
          href={storeNavigations.static.cart.path}
          className="relative flex h-full items-center py-2 hover:text-secondary"
        >
          <ShoppingCart className="w-[22px] md:w-5" />

          {/* <CartCount
            loader={
              <span className="absolute -right-2 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs font-medium text-white"></span>
            }
            error={
              <span className="absolute -right-2 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs font-medium text-white">
                {0}
              </span>
            }
          >
            {({ count }) => (
              <span className="absolute -right-2 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs font-medium text-white">
                {count}
              </span>
            )}
          </CartCount> */}
        </Link>
      </div>
    </div>
  )
}

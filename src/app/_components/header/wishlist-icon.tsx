"use client"

import { HeartIcon } from "lucide-react"
import Link from "next/link"
import { useWishlist } from "~/app/_lib/wishlist-store"
import { accountNavigations } from "~/lib/utils/constants/navigations"
import useStore from "~/lib/utils/hooks/useStore"

export default function WishlistIcon({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props
  const products = useStore({
    store: useWishlist,
    callback: (state) => state.products,
  })

  return (
    <Link
      href={accountNavigations.static.wishlist.path}
      className="relative flex h-full items-center py-2 hover:text-secondary"
    >
      <HeartIcon className="w-[22px] md:w-5" />

      <span className="absolute -right-2 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs font-medium text-white">
        {products?.length ?? 0}
      </span>
    </Link>
  )
}

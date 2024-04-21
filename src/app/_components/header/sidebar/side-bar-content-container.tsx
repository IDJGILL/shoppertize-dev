"use client"

import { UserCircle } from "lucide-react"
import { ScrollArea } from "../../ui/scroll-area"
import Link from "next/link"
import {
  accountNavigations,
  authNavigations,
  storeNavigations,
} from "~/lib/utils/constants/navigations"
import CategoriesMenu from "./categories-menu"
import { AccountMenuLinks } from "../header-navigation-links"
import { useRouter } from "next/navigation"
import { Category } from "~/lib/modules/product/utils/product-types"

interface MenuSideBarContentProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[]
}

export default function MenuSideBarContent({
  ...props
}: MenuSideBarContentProps) {
  const { categories } = props

  const router = useRouter()

  const user = null

  return (
    <div className="text-sm">
      <div
        className="flex cursor-pointer items-center gap-4 bg-[#15678D] px-4 py-4 md:px-8"
        onClick={() =>
          router.push(
            !!user
              ? accountNavigations.static.account.path
              : authNavigations.static.login.path,
          )
        }
      >
        <UserCircle className="h-8 w-8 stroke-2 text-white" />

        <div className="text-white">
          <div className="text-xl ">
            Hello, {user ? user.name?.split(" ")[0] : "There"}
          </div>
          {user ? (
            <>
              <div>Welcome, Manage your account here.</div>
            </>
          ) : (
            <>
              <div>New here? Lets get you Logged In.</div>
            </>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100dvh-64px)] pb-8">
        <ul className="border-b pb-2">
          <h3 className="px-4 pb-2 pt-5 text-lg  md:px-8">Trending</h3>

          <ul>
            <li>
              <Link
                href={storeNavigations.dynamic.shop.path("new-arrivals")}
                className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-zinc-100 md:px-8"
              >
                New Arrivals
              </Link>
            </li>

            <li>
              <Link
                href={storeNavigations.dynamic.shop.path("todays-deal")}
                className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-zinc-100 md:px-8"
              >
                Today’s Deal
              </Link>
            </li>

            <li>
              <Link
                href={storeNavigations.dynamic.shop.path("best-sellers")}
                className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-zinc-100 md:px-8"
              >
                Best Sellers
              </Link>
            </li>
          </ul>
        </ul>

        <ul className="border-b pb-2">
          <h3 className="px-4 pb-2 pt-5 text-lg  md:px-8">
            Shop by Categories
          </h3>

          <CategoriesMenu categories={categories} />
        </ul>

        <div className="pb-4">
          <h3 className="px-4 pb-2 pt-5 text-lg  md:px-8">Help & Settings</h3>

          <AccountMenuLinks user={user} className="py-3 md:px-8" />
        </div>
      </ScrollArea>
    </div>
  )
}

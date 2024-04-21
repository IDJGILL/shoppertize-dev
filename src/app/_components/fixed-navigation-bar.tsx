"use client"

import { Home, Menu, ShoppingCart, User } from "lucide-react"
import FixedBar from "./fixed-bar"
import { useAtom } from "jotai"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "~/lib/utils/functions/ui"
import { sideBarMenuAtom } from "./header/sidebar/side-bar-wrapper"

export default function FixedNavigationBar() {
  const [isOpen, setOpen] = useAtom(sideBarMenuAtom)

  const path = usePathname()

  const router = useRouter()

  const allowedPaths = ["/", "/account"]

  if (!allowedPaths.includes(path)) return null

  const active = {
    home: path === "/",
    profile: path.includes("/account"),
    cart: path.includes("/checkout/cart"),
    menu: isOpen,
  }

  return (
    <FixedBar className="grid grid-cols-4 md:hidden">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center py-4",
          {
            "text-primary": active.home,
          },
        )}
        onClick={() => router.push("/")}
      >
        <Home className="mb-1 h-4 w-4 stroke-2" />
        <p className="text-xs font-medium">Home</p>

        {active.home && (
          <span className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary"></span>
        )}
      </div>

      <div
        className="relative flex flex-col items-center justify-center py-4"
        onClick={() => router.push("/account")}
      >
        <User className="mb-1 h-4 w-4 stroke-2" />
        <p className="text-xs font-medium">You</p>

        {active.profile && (
          <span className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary"></span>
        )}
      </div>

      <div
        className="relative flex flex-col items-center justify-center py-4"
        onClick={() => router.push("/cart")}
      >
        <ShoppingCart className="mb-1 h-4 w-4 stroke-2" />
        <p className="text-xs font-medium">Cart</p>

        {active.cart && (
          <span className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary"></span>
        )}
      </div>

      <div
        className="relative flex flex-col items-center justify-center py-4"
        onClick={() => setOpen(true)}
      >
        <Menu className="mb-1 h-4 w-4 stroke-2" />
        <p className="text-xs font-medium">Menu</p>

        {active.menu && (
          <span className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full bg-primary"></span>
        )}
      </div>
    </FixedBar>
  )
}

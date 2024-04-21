"use client"

import { useAtom } from "jotai"
import { Menu, X } from "lucide-react"
import { cn } from "~/lib/utils/functions/ui"
import { usePathname } from "next/navigation"
import { sideBarMenuAtom } from "./sidebar/side-bar-wrapper"

export function HamMenuTrigger() {
  const [isOpen, setOpen] = useAtom(sideBarMenuAtom)

  const path = usePathname()

  if (path !== "/") return null

  return (
    <div className="h-full">
      <button
        type="button"
        className="flex h-14 items-center justify-center px-4 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu
          className={cn("h-6 w-6 stroke-[1px] text-black", {
            hidden: isOpen,
          })}
        />

        <X
          className={cn("h-6 w-6 stroke-[1px] text-black", {
            hidden: !isOpen,
          })}
        />
      </button>
    </div>
  )
}

export function CategoriesTrigger() {
  const [, setOpen] = useAtom(sideBarMenuAtom)

  return (
    <button
      onClick={() => setOpen(true)}
      className="group flex h-full cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap px-4 font-medium leading-none text-white hover:outline hover:outline-1 hover:outline-white"
    >
      <Menu className="mb-[3px] h-5 w-5 !stroke-white stroke-[2px]" />{" "}
      <span>All Categories</span>
    </button>
  )
}

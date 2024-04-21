"use client"

import { atom, useAtom } from "jotai"
import useScrollLock from "~/lib/utils/hooks/useScrollLock"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils/functions/ui"
import { useUpdateEffect } from "react-use"
import dynamic from "next/dynamic"
import type { Category } from "~/lib/modules/product/utils/product-types"

const MenuSideBarContent = dynamic(
  () => import("./side-bar-content-container"),
  {
    ssr: false,
  },
)

export const sideBarMenuAtom = atom(false)

interface SideBarWrapperProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[]
}

export default function SideBarWrapper({ ...props }: SideBarWrapperProps) {
  const { categories } = props
  const [isOpen, setOpen] = useAtom(sideBarMenuAtom)
  const { lockScroll, unlockScroll } = useScrollLock()

  const path = usePathname()

  const close = () => {
    setOpen(false)
    unlockScroll()
  }

  useUpdateEffect(() => close(), [path])

  useUpdateEffect(() => {
    if (isOpen) return lockScroll()

    close()
  }, [isOpen])

  return (
    <>
      {isOpen ? (
        <>
          <div
            className={cn(
              "fixed left-0 top-0 z-[1000] h-full w-full bg-black bg-opacity-30 opacity-0",
              {
                "opacity-100": isOpen,
              },
            )}
            onClick={() => setOpen(false)}
          ></div>

          {/*  */}
        </>
      ) : null}

      <div
        className={cn(
          "fixed left-0 top-0 z-[10000000000] h-full w-[78%] -translate-x-full overflow-hidden bg-white duration-300 ease-in-out md:w-[28%]",
          {
            "translate-x-0": isOpen,
          },
        )}
      >
        {isOpen && <MenuSideBarContent categories={categories} />}
      </div>
    </>
  )
}

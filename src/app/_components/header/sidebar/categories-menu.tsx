"use client"

import { useState } from "react"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"
import { Minus, Plus } from "lucide-react"
import Link from "next/link"

interface CategoriesMenuProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[]
}

export default function CategoriesMenu({ ...props }: CategoriesMenuProps) {
  const { categories } = props

  return categories.map((item) => (
    <CollapsibleCategoriesItem key={item.id} item={item} />
  ))
}

interface CollapsibleCategoriesItemProps
  extends React.HTMLAttributes<HTMLElement> {
  item: Category
}

function CollapsibleCategoriesItem({
  ...props
}: CollapsibleCategoriesItemProps) {
  const { item } = props
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <li
        onClick={() => {
          setOpen((prev) => !prev)
        }}
        className={cn(
          "flex cursor-pointer select-none items-center justify-between border-b px-4 py-3 hover:bg-zinc-100 md:px-8",
          {
            "border-white": !isOpen,
          },
        )}
      >
        <span>{item.name}</span>

        {isOpen ? (
          <Minus
            className={cn("h-4 w-4", {
              "text-[#15678D]": isOpen,
            })}
          />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </li>

      {isOpen && (
        <div className="border-b bg-zinc-100 pb-2">
          <ul className="py-2">
            {item.childrens.map((child) => (
              <li key={child.id} className="">
                <Link
                  href={storeNavigations.dynamic.shop.path(child.slug)}
                  className="inline-block w-full cursor-pointer items-center justify-between px-4 py-2 hover:bg-zinc-100 hover:text-primary md:px-8"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

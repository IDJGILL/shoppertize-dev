import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { CategoriesTrigger } from "./sidebar-menu-triggers"

export default function HeaderSubBarCategories({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props

  const displayCategories: Category[] = [
    {
      id: "1",
      name: "New Arrivals",
      slug: "new-arrivals",
      hasChildren: false,
      childrens: [],
    },
    {
      id: "2",
      name: "Today’s Deal",
      slug: "todays-deal",
      hasChildren: false,
      childrens: [],
    },
    {
      id: "3",
      name: "Best Sellers",
      slug: "best-sellers",
      hasChildren: false,
      childrens: [],
    },
  ]

  return (
    <div className="hidden bg-[#15678D] pr-4 text-sm md:block">
      <ul className="container flex h-10 flex-wrap items-center py-[1px]">
        <CategoriesTrigger />

        {displayCategories.map((item) => (
          <li
            key={item.id}
            className="group relative h-full hover:outline hover:outline-1 hover:outline-white"
          >
            {item.hasChildren ? (
              <span className="flex h-full cursor-default select-none items-center justify-center gap-2 whitespace-nowrap px-4 font-medium text-white">
                {item.name}

                <ChevronDown className="h-4 w-4 duration-300 ease-in-out group-hover:rotate-180" />
              </span>
            ) : (
              <Link
                className="flex h-full items-center px-4 text-center text-white"
                href={storeNavigations.dynamic.shop.path(item.slug)}
              >
                {item.name}
              </Link>
            )}

            <div className="absolute left-0 top-[39px] hidden w-full rounded-b bg-white shadow-md group-hover:block">
              {item.childrens.map((child) => (
                <ul key={child.id}>
                  <li className="">
                    <Link
                      href={storeNavigations.dynamic.shop.path(child.slug)}
                      className="inline-block w-full items-center justify-between px-2 py-2 hover:bg-zinc-100"
                    >
                      <span>{child.name}</span>
                      {/* <ArrowRight className="inline-block h-3 w-3" /> */}
                    </Link>
                  </li>
                </ul>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

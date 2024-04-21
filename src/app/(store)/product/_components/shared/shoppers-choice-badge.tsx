"use client"

import { useRouter } from "next/navigation"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"

interface ShoppersChoiceProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ShoppersChoice({ ...props }: ShoppersChoiceProps) {
  const category = props.product.productCategories.nodes[1]

  const router = useRouter()

  return (
    <div className={cn("flex items-center gap-2", props.className)}>
      <div className="flex max-w-max items-center gap-2 rounded-full bg-[#0F475F] py-[6px] pl-2 pr-4 text-xs leading-none text-white md:text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 fill-primary md:h-5 md:w-5"
        >
          <path
            className=" stroke-none"
            d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <div className="flex gap-1">
          <span>{`Shopper's`}</span>
          <span className="text-[#ff8113]">choice</span>
        </div>
      </div>

      {category ? (
        <div className="">
          for{" "}
          <span
            className="link text-sm"
            onClick={() =>
              router.push(storeNavigations.dynamic.shop.path(category.slug))
            }
          >
            {category.name}
          </span>
        </div>
      ) : null}
    </div>
  )
}

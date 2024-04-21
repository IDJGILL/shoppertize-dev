"use client"

import { Checkbox } from "~/app/_components/ui/checkbox"
import { type CheckedState } from "@radix-ui/react-checkbox"
import { cn } from "~/lib/utils/functions/ui"
import { useShopContext } from "../utils/shop-context"
import { base64 } from "~/lib/utils/functions/base64"
import { type Sort } from "../utils/shop-types"

interface ShopCollectionFiltersProps
  extends React.HTMLAttributes<HTMLElement> {}

export function ShopCollectionFilters({
  ...props
}: ShopCollectionFiltersProps) {
  const { filterHandler, filters } = useShopContext()

  if (!filters || !!!filters.collections.main.length) return null

  return (
    <div>
      {!!props.title && <div className="mb-4 font-medium">{props.title}</div>}

      <div className={cn("grid gap-3", props.className)}>
        {filters.collections.main.map((category) => (
          <CheckBox
            key={category.id}
            id={category.id.toString()}
            label={category.name}
            onCheckedChange={(checked) => {
              filterHandler({
                type: "collection",
                value: base64.parse<string>({
                  base64Id: category.id,
                  index: 1,
                }),
                remove: !!!checked,
              })
            }}
            checked={category.isActive}
          />
        ))}
      </div>
    </div>
  )
}

const sortFilters = [
  {
    id: "trending",
    name: "Trending",
    value: "latest",
  },
  {
    id: "price-asc",
    name: "Price: Low to high",
    value: "price-asc",
  },
  {
    id: "price-desc",
    name: "Price: High to low",
    value: "price-desc",
  },
] satisfies { id: string; name: string; value: Sort }[]

interface ShopProductSortFiltersProps
  extends React.HTMLAttributes<HTMLElement> {}

export function ShopProductSortFilters({
  ...props
}: ShopProductSortFiltersProps) {
  const { filterHandler, filter } = useShopContext()

  return (
    <div>
      {!!props.title && <div className="mb-4 font-medium">{props.title}</div>}

      <div className={cn("grid gap-3", props.className)}>
        {sortFilters.map((sort) => (
          <CheckBox
            key={sort.id}
            id={sort.id.toString()}
            label={sort.name}
            onCheckedChange={(checked) =>
              filterHandler({
                type: "sort",
                value: sort.value,
                remove: !!!checked,
              })
            }
            checked={filter.sort === sort.value}
          />
        ))}
      </div>
    </div>
  )
}

interface CheckBoxProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  id: string
  checked?: CheckedState | undefined
  onCheckedChange: (checked: CheckedState) => void
}

export function CheckBox({ ...props }: CheckBoxProps) {
  const { id, label, checked, onCheckedChange } = props

  return (
    <li className="flex items-center space-x-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />

      <label
        htmlFor={id}
        className="cursor-pointer select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </li>
  )
}

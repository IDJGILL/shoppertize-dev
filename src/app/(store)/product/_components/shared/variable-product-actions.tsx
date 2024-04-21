"use client"

import { Button } from "~/app/_components/ui/button"
import { cn } from "~/lib/utils/functions/ui"
import { type UseVariationProductActions } from "~/lib/utils/hooks/useVariationsProductActions"

interface VariableProductActionsProps
  extends React.HTMLAttributes<HTMLElement> {
  utils: UseVariationProductActions
}

export default function VariableProductActions({
  ...props
}: VariableProductActionsProps) {
  const { utils } = props

  return (
    <div>
      <div className="mb-6 space-y-6">
        <div>
          <div className="mb-4 text-sm uppercase">
            {utils.baseVariantSelector.label}
          </div>

          <BaseVariationSelector
            option={utils.baseVariantSelector}
            onValueChange={utils.baseVariationSelectorHandler}
          />
        </div>

        {utils.subVariantSelector ? (
          <div>
            <div className="mb-4 text-sm uppercase">
              {utils.subVariantSelector.label}
            </div>

            <SubVariationSelector
              option={utils.subVariantSelector}
              onValueChange={utils.subVariationSelectorHandler}
              selected={utils.selectedSubVariant.value}
            />

            <div>{utils.selectedSubVariant.errorMessage}</div>
          </div>
        ) : null}
      </div>

      <div className="mb-5 space-x-4">
        <Button size="lg" onClick={() => utils.addToCart()}>
          Add to cart
        </Button>

        <Button size="lg">Wishlist</Button>
      </div>
    </div>
  )
}

interface BaseVariationSelectorProps extends React.HTMLAttributes<HTMLElement> {
  onValueChange: (value: string) => void
  option: VariationOption
}

export function BaseVariationSelector({
  ...props
}: BaseVariationSelectorProps) {
  const { onValueChange, option } = props

  const handleChange = (value: string) => {
    onValueChange(value)
  }

  return (
    <ul className="flex w-full gap-4">
      {option.options.map((item) => (
        <li key={item.option}>
          <input
            id={item.option}
            type="checkbox"
            className="peer hidden"
            value={item.option}
            checked={item.isActive && item.isInStock}
            onChange={(e) => handleChange(e.target.value)}
            disabled={!item.isInStock}
          />

          <label
            htmlFor={item.option}
            className={cn(
              "flex aspect-square h-[40px] w-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-md border uppercase hover:bg-slate-600 peer-checked:bg-slate-600 peer-checked:text-white",
              {
                "cursor-not-allowed line-through opacity-25": !item.isInStock,
              },
            )}
          >
            {item.option}
          </label>
        </li>
      ))}
    </ul>
  )
}

interface SubVariationSelectorProps extends React.HTMLAttributes<HTMLElement> {
  onValueChange: (value: string) => void
  option: VariationOption
  selected: string
}

export function SubVariationSelector({ ...props }: SubVariationSelectorProps) {
  const { onValueChange, option, selected } = props

  const handleChange = (value: string) => {
    onValueChange(value)
  }

  return (
    <ul className="flex w-full gap-4">
      {option.options.map((item) => (
        <li key={item.option}>
          <input
            id={item.option}
            type="checkbox"
            className="peer hidden"
            value={item.option}
            checked={item.option === selected && item.isInStock}
            onChange={(e) => handleChange(e.target.value)}
            disabled={!item.isInStock}
          />

          <label
            htmlFor={item.option}
            className={cn(
              "flex aspect-square h-[40px] w-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-md border uppercase hover:bg-slate-600 peer-checked:bg-slate-600 peer-checked:text-white",
              {
                "cursor-not-allowed line-through opacity-25": !item.isInStock,
              },
            )}
          >
            {item.option}
          </label>
        </li>
      ))}
    </ul>
  )
}

"use client"

import { ChevronDown, X } from "lucide-react"
import ProductImage from "~/app/_components/product-image"
import { currency } from "~/constants"
import { formatPrice } from "~/lib/utils/functions/format-price"
import { type MainCartItem } from "~/lib/modules/cart/cart-types"
import { useCartContext } from "~/vertex/components/cart/cart-context"
import { RemoveItem } from "~/vertex/components/cart/remove-item"
import { UpdateQuantity, type UpdateQuantityAction } from "~/vertex/components/cart/update-quantity"
import { useState } from "react"
import { cn } from "~/lib/utils/functions/ui"
import { useUpdateEffect } from "react-use"
import { DialogFooter, ModelXDrawer } from "~/app/_components/ui/dialog"
import { Button } from "~/app/_components/ui/button"

interface CartItemsProps extends React.HTMLAttributes<HTMLElement> {}

export function CartItems({ ...props }: CartItemsProps) {
  const {} = props

  const { items } = useCartContext()

  return (
    <div>
      {items.map((a) => (
        <CartItemCard key={a.key} product={a} />
      ))}
    </div>
  )
}

interface CartItemCardProps extends React.HTMLAttributes<HTMLElement> {
  product: MainCartItem
}

export function CartItemCard({ ...props }: CartItemCardProps) {
  const { product } = props

  return (
    <div className="relative flex gap-4 overflow-hidden border-b py-4 last:border-none">
      <div className="w-[15%] min-w-[80px]">
        <ProductImage sourceUrl={product.image.sourceUrl} lazyLoad />
      </div>

      <div className="w-[82%]">
        <h4 className="mb-2 mr-8 line-clamp-2 text-xs font-medium md:text-sm">
          {product.name} X {product.quantity}
        </h4>

        <div className="mt-2">
          <span className="mr-2 text-sm ">
            {currency}
            {formatPrice({ price: product.price ?? "0" })}
          </span>
          <span className="mr-1 text-xs text-muted-foreground line-through sm:text-sm">
            {currency}
            {formatPrice({ price: product.regularPrice ?? "0" })}
          </span>

          <span className="text-xs text-green-500 sm:text-sm">
            (
            {Math.floor(
              ((+(product.regularPrice ?? "0") - +(product.price ?? "0")) / +(product.regularPrice ?? "0")) * 100,
            )}
            % off)
          </span>
        </div>

        {product.stockStatus === "IN_STOCK" && (
          <div className="mt-4 inline-flex gap-4">
            <UpdateQuantity cartItem={{ id: product.key }}>
              {(action) => <QuantityAction action={action} cartItem={product} />}
            </UpdateQuantity>
          </div>
        )}

        {product.stockStatus === "OUT_OF_STOCK" && (
          <div className="mt-4 max-w-max rounded border border-red-400 bg-red-100 px-2 py-1 text-sm text-red-700">
            Out of Stock
          </div>
        )}

        {product.error && <div className="py-4 text-sm text-red-700">{product.error.message}</div>}
      </div>

      <div className="absolute right-0 top-5 flex items-center justify-center">
        <RemoveItem cartItem={{ id: product.key }}>
          {(a) => {
            if (a.isLoading) return <div>Removing...</div>

            return <X className=" cursor-pointer" onClick={() => a.mutate()} />
          }}
        </RemoveItem>
      </div>
    </div>
  )
}

interface QuantityActionProps extends React.HTMLAttributes<HTMLElement> {
  cartItem: MainCartItem
  action: UpdateQuantityAction
}

function QuantityAction({ ...props }: QuantityActionProps) {
  const { cartItem, action } = props

  const [isOpen, OpenSet] = useState(false)
  const [quantity, setQuantity] = useState(cartItem.quantity)

  const handleUpdate = () => {
    action.mutate(quantity)
  }

  useUpdateEffect(() => {
    if (action.status === "hasSucceeded") OpenSet(false)
  }, [action.status])

  return (
    <>
      <button
        onClick={() => OpenSet(true)}
        className={cn("inline-flex items-center rounded-xl bg-slate-100 px-4 py-1 text-xs ", {
          "outline outline-1 outline-destructive": !cartItem.hasSelectedQuantity,
        })}
      >
        <span>Qty: {cartItem.quantity}</span> <ChevronDown className="w-3" />
      </button>

      <ActionModelWrapper
        title="Select Quantity"
        isOpen={isOpen}
        open={() => OpenSet(true)}
        close={() => OpenSet(false)}
        onOpenChange={OpenSet}
        isLoading={action.status === "executing"}
        update={() => handleUpdate()}
      >
        <div
          className={cn("flex flex-wrap items-center justify-center gap-4", {
            "outline outline-1 outline-destructive": !cartItem.hasSelectedQuantity,
          })}
        >
          {cartItem.quantityOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => setQuantity(item.value)}
              className={cn(
                "flex aspect-square h-11 w-11 cursor-pointer items-center justify-center rounded-full border px-2 py-2 text-center hover:bg-slate-50",
                {
                  "bg-primary text-white hover:bg-primary": quantity === item.value,
                },
              )}
            >
              <span className="cursor-pointer uppercase">{item.name}</span>
            </div>
          ))}
        </div>
      </ActionModelWrapper>
    </>
  )
}

interface ActionModelWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  open: () => void
  close: () => void
  isLoading: boolean
  update: () => void
}

export function ActionModelWrapper({ ...props }: ActionModelWrapperProps) {
  return (
    <ModelXDrawer
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      title={props.title}
      description="Select the quantity you need from the options below."
      isLoading={props.isLoading}
      footer={
        <DialogFooter>
          <Button
            type="button"
            loading={props.isLoading ? "true" : "false"}
            className="w-full"
            onClick={() => props.update()}
          >
            Save
          </Button>
        </DialogFooter>
      }
      className=""
    >
      <div className="py-4">{props.children}</div>
    </ModelXDrawer>
  )
}

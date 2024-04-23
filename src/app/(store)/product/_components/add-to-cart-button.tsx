"use client"

import { Button } from "~/app/_components/ui/button"
import { useAddToCart } from "~/vertex/components/cart/AddToCart/adtc-context"

interface AddToCartButtonProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddToCartButton({ ...props }: AddToCartButtonProps) {
  const { mutate, isLoading, isOutOfStock } = useAddToCart()

  return (
    <Button onClick={() => mutate()} disabled={isOutOfStock} loading={isLoading ? "true" : "false"}>
      {isOutOfStock ? "Out of Stock" : "Add To Cart"}
    </Button>
  )
}

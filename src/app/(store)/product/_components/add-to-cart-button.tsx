"use client"

import { Button } from "~/app/_components/ui/button"
import { useAddToCart } from "~/vertex/components/cart/AddToCart/adtc-context"

interface AddToCartButtonProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddToCartButton({ ...props }: AddToCartButtonProps) {
  const { mutate, isLoading } = useAddToCart()

  return (
    <Button onClick={() => mutate()} loading={isLoading ? "true" : "false"}>
      Add To Cart
    </Button>
  )
}

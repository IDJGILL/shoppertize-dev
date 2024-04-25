"use client"

import { Button } from "~/app/_components/ui/button"
import Navigate from "~/lib/modules/app/components/navigate"
import { useCartContext } from "~/vertex/components/cart/cart-context"

interface EmptyCartWrapperProps extends React.HTMLAttributes<HTMLElement> {}

export default function EmptyCartWrapper({ ...props }: EmptyCartWrapperProps) {
  const {} = props

  const { isCartEmpty } = useCartContext()

  if (isCartEmpty) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-5 text-4xl font-semibold tracking-tighter">Your Cart is Empty</h2>
          <p className="mb-9 text-balance">Looks like you {`don't`} have items in your cart, Start shopping now!</p>

          <Navigate to="home">
            <Button size="sm">Start shopping</Button>
          </Navigate>
        </div>
      </div>
    )
  }

  return <>{props.children}</>
}

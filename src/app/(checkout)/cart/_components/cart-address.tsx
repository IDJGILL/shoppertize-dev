"use client"

import { useCartContext } from "~/vertex/components/cart/cart/context"

interface CartAddressProps extends React.HTMLAttributes<HTMLElement> {}

export default function CartAddress({ ...props }: CartAddressProps) {
  const {} = props

  const { address } = useCartContext()

  return <div>{address?.shipping.address1}</div>
}

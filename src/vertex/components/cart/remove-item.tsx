"use client"

import { type HookActionStatus } from "next-safe-action/hooks"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { removeItem } from "~/vertex/modules/cart/cart-actions"
import { type CartItemRecord } from "~/vertex/modules/cart/cart-types"

interface RemoveItemProps {
  cartItem: Omit<CartItemRecord, "quantity">
  children: (props: {
    mutate: () => void
    status: HookActionStatus
    isLoading: boolean
  }) => React.ReactNode
}

/**
 * Lets you remove cart item from either cookie store or user database.
 *
 * @requires ServerComponent
 *
 * @example
 * import { RemoveItem } from "~/vertex/components/cart/remove-item"
 *
    <RemoveItem cartItem={{ id: "product-here" }}>
        {(p) => <button onClick={() => p.mutate()}>Remove</button>}
    </RemoveItem>
 */
export function RemoveItem({ ...props }: RemoveItemProps) {
  const {} = props

  const action = useActionHandler(removeItem)

  const mutate = () => action.mutate({ id: props.cartItem.id, quantity: 0 })

  const actionProps = {
    ...action,
    mutate,
  }

  return <>{props.children(actionProps)}</>
}

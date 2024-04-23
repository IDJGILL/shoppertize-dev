"use client"

import { type HookActionStatus } from "next-safe-action/hooks"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { updateQuantity } from "~/vertex/lib/action/actions"
import { type CartItemRecord } from "~/vertex/modules/cart/cart-types"
import { api } from "~/vertex/lib/trpc/trpc-context-provider"

interface UpdateQuantityComponentProps {
  cartItem: Omit<CartItemRecord, "quantity">
  children: (props: UpdateQuantityAction) => React.ReactNode
}

export type UpdateQuantityAction = {
  mutate: (quantity: number) => void
  status: HookActionStatus
  isLoading: boolean
}

/**
 * Lets you update item quantity.
 *
 * @requires ServerComponent
 *
 * @example
 * import { UpdateQuantity } from "~/vertex/components/cart/remove-item"
 *
    <UpdateQuantity cartItem={{ id: "product-here" }}>
        {(p) => <button onClick={() => p.mutate(1)}>Remove</button>}
    </UpdateQuantity>
 */
export function UpdateQuantity({ ...props }: UpdateQuantityComponentProps) {
  const {} = props

  const utils = api.useUtils()

  const action = useActionHandler(updateQuantity, {
    onSuccess: async () => {
      await utils.cart.count.prefetch()
    },
  })

  const mutate = (quantity: number) => {
    action.mutate({ id: props.cartItem.id, quantity })
  }

  const actionProps = {
    ...action,
    mutate,
  }

  return <>{props.children(actionProps)}</>
}

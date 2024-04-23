"use client"

import { api } from "~/vertex/lib/trpc/trpc-context-provider"

interface CartCountProps {
  error: React.ReactElement
  loader: React.ReactElement
  children: (props: { count: number }) => React.ReactNode
}

/**
 * Lets you display current cart items count from either cookie store or user database.
 *
 * @requires ServerComponent
 *
 * @example
 * import { CartCount } from "~/vertex/components/cart/CartCount"
 *
 * <CartCount>{({ count }) => <div>{count}</div>}</CartCount>
 */
export function CartCount({ ...props }: CartCountProps) {
  const {} = props

  const { data } = api.cart.count.useQuery()

  return <>{props.children({ count: data ?? 0 })}</>
}

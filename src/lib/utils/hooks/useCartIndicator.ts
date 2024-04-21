import { api } from "~/lib/server/access/client"

// export type CartIndicatorProps = {
// }

export default function useCartIndicator() {
  const utils = api.store.cart.getCartIndicator.useQuery(undefined, {
    refetchOnMount: true,
  })

  return utils
}

export type UseCartIndicatorOutputType = ReturnType<typeof useCartIndicator>

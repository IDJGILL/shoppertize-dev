"use client"

import { useRouter } from "next/navigation"
import { createContext, useContext } from "react"
import { toast } from "sonner"
import { api } from "~/lib/trpc/trpc-client"
import type { RouterOutput } from "~/lib/trpc/trpc-types"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { highlightSection } from "~/lib/utils/functions/highlight-section"

const CartContext = createContext<ReturnType<
  typeof useCartContextLogic
> | null>(null)

interface CartClientContextProps extends React.HTMLAttributes<HTMLElement> {
  data: RouterOutput["cart"]["get"]
}

export function CartClientContext({ ...props }: CartClientContextProps) {
  const { data } = props

  return (
    <CartContext.Provider value={useCartContextLogic(data)}>
      {props.children}
    </CartContext.Provider>
  )
}

function useCartContextLogic(initialData: RouterOutput["cart"]["get"]) {
  const router = useRouter()

  const {
    data: { data },
  } = api.cart.get.useQuery(undefined, {
    retry: 0,
    initialData,
  })

  const apiContext = api.useUtils()

  const updateApi = api.cart.update.useMutation({
    onSuccess: async () => {
      await apiContext.cart.get.prefetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const removeApi = api.cart.remove.useMutation({
    onSuccess: async () => {
      await apiContext.cart.get.prefetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const setPincodeApi = api.courier.setPincode.useMutation({
    onSuccess: async () => {
      await apiContext.cart.get.invalidate()
    },
  })

  const hasShipping = !!data?.shippingAddress?.address1

  const isShippingError =
    data?.items.some((a) => a.error?.errorEnum === "shipping") ?? !hasShipping

  const isQuantityError = data?.items.some(
    (a) => a.error?.errorEnum === "quantity",
  )

  const isStockError = data?.items.some((a) => a.error?.errorEnum === "stock")

  const onClickHandler = () => {
    switch (true) {
      case isShippingError: {
        router.push("/checkout/address")

        break
      }

      case isQuantityError: {
        highlightSection("cart-items")

        break
      }

      case isStockError: {
        highlightSection("cart-items")

        break
      }

      default: {
        router.push(storeNavigations.static.payment.path)
      }
    }
  }

  const isCartEmpty = !data

  return {
    data,
    updateApi,
    removeApi,
    setPincodeApi,
    isShippingError,
    isQuantityError,
    isStockError,
    isCartEmpty,
    onClickHandler,
  }
}

export const useCartContext = () => {
  const context = useContext(CartContext)

  if (!context) throw new Error("Please wrap the parent inside context")

  return context
}

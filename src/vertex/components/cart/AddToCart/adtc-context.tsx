"use client"

import { useRouter } from "next/navigation"
import { createContext, useContext } from "react"
import { toast } from "sonner"
import { useRevalidate } from "~/vertex/lib/action/hook"
import { api } from "~/vertex/lib/trpc/trpc-context-provider"

type InitialData = Pick<
  GqlDataProps,
  "id" | "type" | "slug" | "price" | "regularPrice" | "stockQuantity" | "stockStatus" | "lowStockAmount" | "manageStock"
>

export const AddToCartContext = createContext<ReturnType<typeof useAddToCartLogic> | null>(null)

const useAddToCartLogic = (data: InitialData) => {
  const utils = api.useUtils()

  const revalidate = useRevalidate()

  const router = useRouter()

  const addToCartApi = api.cart.add.useMutation({
    onSuccess: async () => {
      await utils.cart.count.invalidate()

      revalidate({ paths: ["/cart"], tags: [] })
    },
    onError: (error) => {
      toast.error(error.message)

      revalidate({ paths: ["/cart"], tags: [] })

      router.refresh()
    },
  })

  const mutate = () => {
    addToCartApi.mutate({ id: data.id as string, quantity: 1 })
  }

  return {
    mutate,
    isLoading: addToCartApi.isPending,
    isError: addToCartApi.isError,
    error: addToCartApi.error?.message,
    isOutOfStock: data.stockStatus === "OUT_OF_STOCK",
  }
}

export const useAddToCart = () => {
  const context = useContext(AddToCartContext)

  if (!context) throw new Error("Please use useAddToCart hook inside AddToCart")

  return context
}

interface AddToCartProps extends React.HTMLAttributes<HTMLElement> {
  initialData: InitialData
}

export function AddToCartContextProvider({ ...props }: AddToCartProps) {
  const { initialData } = props

  return <AddToCartContext.Provider value={useAddToCartLogic(initialData)}>{props.children}</AddToCartContext.Provider>
}

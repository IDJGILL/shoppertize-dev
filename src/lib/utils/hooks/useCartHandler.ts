import { toast } from "sonner"
import { api } from "~/lib/server/access/client"
import { decodeVariableIds } from "../functions/decode-variable-ids"

export default function useCartHandler() {
  const {
    data,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
  } = api.store.cart.getCart.useQuery(undefined, {
    refetchOnMount: true,
  })

  const context = api.useContext()

  const { mutate: remove, isLoading: isItemRemoving } =
    api.store.cart.removeCartItems.useMutation({
      onSuccess: async () => {
        await context.store.cart.getCart.invalidate()
      },
    })

  const removeItem = (key: string) => {
    remove({ keys: [key], isAll: false })
  }

  const {
    mutate: updateCartItemVariant,
    isLoading: isVariantUpdating,
    isSuccess: isVariantUpdated,
  } = api.store.cart.switchVariation.useMutation({
    onSuccess: async () => {
      await context.store.cart.getCart.invalidate()
    },
    onError: async (error) => {
      await context.store.cart.getCart.invalidate()
      toast.error(error.message)
    },
  })

  const updateVariant = (product: VariationCartItem, option: string) => {
    if (!data) return
    const alreadyExist = data.cartItems.find(
      (item) =>
        decodeVariableIds(item.id).parentId ===
          decodeVariableIds(product.id).parentId &&
        item.type === "VARIATION" &&
        item.attributes.nodes.some(
          (a) =>
            a.name === product.attributes.nodes[0]!.name &&
            a.value === product.attributes.nodes[0]!.value,
        ) &&
        item.attributes.nodes.some(
          (a) =>
            a.name === product.attributes.nodes[1]!.name && a.value === option,
        ),
    )

    if (alreadyExist) {
      toast.error(
        `${
          product.attributes.nodes[1]!.label
        } - ${option.toUpperCase()} already exist in your cart`,
      )
      return
    }

    updateCartItemVariant({
      id: product.id,
      key: product.key,
      quantity: product.quantity,
      currentBaseAttribute: product.attributes.nodes[0]!,
      selectedAttribute: {
        id: product.attributes.nodes[1]!.id,
        label: product.attributes.nodes[1]!.label,
        name: product.attributes.nodes[1]!.name,
        value: option,
      },
    })
  }

  const {
    mutate: updateQty,
    isLoading: isQuantityUpdating,
    isSuccess: isQuantityUpdated,
  } = api.store.cart.updateQuantity.useMutation({
    onSuccess: async () => {
      await context.store.cart.getCart.invalidate()
    },
    onError: async () => {
      await context.store.cart.getCart.invalidate()
    },
  })

  const updateQuantity = (key: string, quantity: number) => {
    updateQty({ key, quantity })
  }

  return {
    data,
    removeItem,
    updateVariant,
    updateQuantity,
    isCartLoading,
    isCartFetching,
    isItemRemoving,
    isVariantUpdating,
    isVariantUpdated,
    isQuantityUpdating,
    isQuantityUpdated,
  }
}

export type UseCartHandlerOutputType = ReturnType<typeof useCartHandler>

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "~/lib/server/access/client"
import { hasSubVariant } from "../functions/has-sub-variant"
import { decodeBase64Id } from "../functions/decodeBase64Id"

export type VariationProductActionsProps = {
  product: VariableProduct
  variation: Variation
}

export default function useVariationProductActions(
  props: VariationProductActionsProps,
) {
  const { product, variation: currentVariation } = props
  const [selectedSubVariant, setSubVariant] = useState({
    value: "",
    errorMessage: "",
  })

  const router = useRouter()

  const context = api.useContext()

  const hasSelectedSubVariant = selectedSubVariant.value !== ""

  const variantOptions = getVariantOptions(product, currentVariation)

  const { mutateAsync, isLoading } = api.store.cart.addToCart.useMutation({
    onSuccess: async () => {
      await context.store.cart.getCart.invalidate()
      await context.store.cart.getCartIndicator.invalidate()
    },
  })

  const addToCart = async () => {
    if (hasSubVariant(product) && !hasSelectedSubVariant) {
      return setSubVariant({
        value: "",
        errorMessage: `Please select ${
          product.attributes.nodes[1]?.label ?? ``
        } to continue.`,
      })
    }

    return await mutateAsync({
      type: "VARIABLE",
      parentDataBaseId: parseInt(decodeBase64Id(product.id)),
      variationDataBaseId: parseInt(decodeBase64Id(currentVariation.id)),
      requestedQuantity: 1,
    })
      .then(() => {
        toast.success("Added to Cart")
      })
      .catch((error: Error) => toast.error(error.message))
  }

  const baseVariationSelectorHandler = (input: string) => {
    const currentBaseVariant = currentVariation.attributes.nodes[0]

    if (!hasSubVariant(product)) {
      const variation = product.variations.nodes.find((item) =>
        item.attributes.nodes.some(
          (att) => att.name === currentBaseVariant?.name && att.value === input,
        ),
      )

      if (!variation) return

      return router.replace(`?variant=${variation.id}`)
    }

    const currentSubVariant = currentVariation.attributes.nodes[1]

    const variation = product.variations.nodes.find(
      (item) =>
        item.attributes.nodes.some(
          (att) => att.name === currentBaseVariant?.name && att.value === input,
        ) &&
        item.attributes.nodes.some(
          (att) =>
            att.name === currentSubVariant?.name &&
            att.value === currentSubVariant.value,
        ),
    )

    if (!variation) return

    return router.replace(`?variant=${variation.id}`)
  }

  const subVariationSelectorHandler = (input: string) => {
    const currentBaseVariant = currentVariation.attributes.nodes[0]
    const currentSubVariant = currentVariation.attributes.nodes[1]

    setSubVariant({
      value: input,
      errorMessage: "",
    })

    const variation = product.variations.nodes.find(
      (item) =>
        item.attributes.nodes.some(
          (att) =>
            att.name === currentBaseVariant?.name &&
            att.value === currentBaseVariant.value,
        ) &&
        item.attributes.nodes.some(
          (att) => att.name === currentSubVariant?.name && att.value === input,
        ),
    )

    if (!variation) return

    return router.replace(`?variant=${variation.id}`)
  }

  const hasSubVariationSelector = hasSubVariant(product)

  return {
    product,
    addToCart,
    isLoading,
    baseVariantSelector: variantOptions.baseVariantSelector,
    subVariantSelector: variantOptions.subVariantSelector,
    baseVariationSelectorHandler,
    subVariationSelectorHandler,
    hasSubVariationSelector,
    hasSelectedSubVariant,
    selectedSubVariant,
  }
}

const getVariantOptions = (
  product: VariableProduct,
  currentVariation: Variation,
) => {
  const selectedBaseAttribute = currentVariation.attributes.nodes[0]

  const options = getOptions(
    product,
    currentVariation,
    selectedBaseAttribute!.value,
  )

  const baseVariantSelector = options[0]!

  const subVariantSelector = options[1] ? options[1] : null

  return {
    baseVariantSelector,
    subVariantSelector,
  }
}

const getOptions = (
  product: VariableProduct,
  currentVariation: Variation,
  baseValue: string,
): VariationOption[] => {
  const attributes = product.attributes.nodes

  const selectedBaseAttribute = currentVariation.attributes.nodes[0]

  const BASE_ATTRIBUTE = attributes[0]

  const checkBaseValue = (input: string) => {
    const findVariationByStock = product.variations.nodes.filter((item) =>
      item.attributes.nodes.some(
        ({ name, value }) =>
          name === BASE_ATTRIBUTE?.name &&
          value === input &&
          item.stockStatus === "IN_STOCK",
      ),
    )

    return findVariationByStock.length !== 0
  }

  if (!hasSubVariant(product)) {
    return attributes.map((attribute) => {
      return {
        ...attribute,
        options: attribute.options.map((item) => ({
          option: item,
          isInStock: checkBaseValue(item),
          isActive: selectedBaseAttribute?.value === item,
        })),
      }
    })
  }

  // Sub variant selector options
  const SUB_ATTRIBUTE = attributes[1]

  const inStockSubVariantOptions = product.variations.nodes
    .filter((item) =>
      item.attributes.nodes.some(
        ({ name, value }) =>
          name === BASE_ATTRIBUTE?.name &&
          value === baseValue &&
          item.stockStatus === "IN_STOCK",
      ),
    )
    .map(
      (item) =>
        item.attributes.nodes.find((item) => item.name === SUB_ATTRIBUTE?.name)
          ?.value,
    )

  return attributes.map((attribute) => {
    if (attribute.name === SUB_ATTRIBUTE?.name) {
      return {
        ...attribute,
        options: attribute.options.map((item) => ({
          option: item,
          isInStock: inStockSubVariantOptions.includes(item),
          isActive: false,
        })),
      }
    }

    return {
      ...attribute,
      options: attribute.options.map((item) => ({
        option: item,
        isInStock: true,
        isActive: selectedBaseAttribute?.value === item,
      })),
    }
  })
}

export type UseVariationProductActions = ReturnType<
  typeof useVariationProductActions
>

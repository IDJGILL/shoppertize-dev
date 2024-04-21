import { calculateGst } from "./calculate-gst"
import { decodeVariableIds } from "./decode-variable-ids"
import { extractPrice } from "./extract-price"

export const filterProductsByCartItemRecords = (
  itemRecords: CartItemRecord[],
  data: CartProduct[],
  customer?: {
    shipping: {
      postcode: string
      state: string
      city: string
    }
  },
) => {
  const simpleItemIds = itemRecords
    .filter((item) => !item.variants)
    .map((item) => item.id)

  const variableItemIds = itemRecords
    .filter((item) => item.variants)
    .map((item) => decodeVariableIds(item.id).variationId)
    .flat()

  const combinedCartItemsId = [...simpleItemIds, ...variableItemIds]

  const simpleProducts = data.filter((item) => item.type === "SIMPLE")

  const variationProducts = data
    .filter((item) => item.type === "VARIABLE")
    .map((item) => (item as VariableCartProduct).variations?.nodes)
    .flat()

  const combinedProducts = [
    ...(simpleProducts ?? []),
    ...(variationProducts ?? []),
  ]

  const getQuantityOptions = (
    stockQuantity: number,
    currentQuantity: number,
  ) => {
    return Array(Math.min(stockQuantity > 0 ? stockQuantity : 0, 10))
      .fill(" ")
      .map((_, i) => ({
        id: (i + 1).toString(),
        name: i + 1,
        label: i + 1,
        value: i + 1,
        isActive: i + 1 === currentQuantity,
      }))
  }

  const filteredProducts: CartItem[] = combinedProducts.reduce<CartItem[]>(
    (acc, product) => {
      const cartItemRecord = itemRecords.find(
        (item) =>
          (item.variants ? decodeVariableIds(item.id).variationId : item.id) ===
          product.id,
      )

      if (combinedCartItemsId.includes(product.id) && cartItemRecord) {
        if (product.type === "SIMPLE") {
          const quantityOptions = getQuantityOptions(
            product.stockQuantity,
            cartItemRecord.quantity,
          )

          const checkErrors = (): CartItemError | null => {
            if (product.stockStatus === "OUT_OF_STOCK") {
              return {
                type: "stock_error",
                message:
                  "The item is currently out of stock. Please remove the item.",
              }
            }

            if (!!!quantityOptions.find((option) => option.isActive)) {
              return {
                type: "quantity_error",
                message:
                  "Please select a quantity lower or equal to the available stock.",
              }
            }

            if (!customer) return null

            if (!product.productSettings.allowedShippingPincodes) return null

            const allowedPincodes =
              product.productSettings.allowedShippingPincodes.split("\r\n")

            if (!allowedPincodes.includes(customer.shipping.postcode)) {
              return {
                type: "shipping_error",
                message: `Shipping for ${customer.shipping.city} for this item is not available at this moment. Please change the address or remove the item.`,
              }
            }

            return null
          }

          acc.push({
            type: "SIMPLE",
            id: cartItemRecord.id,
            key: cartItemRecord.key,
            name: product.name,
            image: product.image,
            price: (
              parseInt(product.price) * cartItemRecord.quantity
            ).toString(),
            regularPrice: product.regularPrice,
            quantity: cartItemRecord.quantity,
            quantityOptions: quantityOptions,
            hasSelectedQuantity:
              !!quantityOptions.find((option) => option.isActive) ||
              product.stockStatus === "OUT_OF_STOCK",
            stockQuantity: product.stockQuantity,
            stockStatus: product.stockStatus,
            tax: calculateGst(
              extractPrice(product.price) * cartItemRecord.quantity,
              product.taxClass,
            ),
            error: checkErrors(),
          })
        }

        if (product.type === "VARIATION") {
          const variation = data.find(
            (item) =>
              item.type === "VARIABLE" &&
              item.variations.nodes.find(
                (variation) => variation.id === product.id,
              ),
          ) as VariableCartProduct | undefined

          if (!variation) return acc

          const baseVariant = product.attributes.nodes[0]!

          const subVariant = product.attributes.nodes[1] ?? null

          const inStockSubVariantOptions = variationProducts
            .filter((item) =>
              item.attributes.nodes.some(
                ({ name, value }) =>
                  name === baseVariant.name &&
                  value === baseVariant.value &&
                  item.stockStatus === "IN_STOCK",
              ),
            )
            .map(
              (item) =>
                item.attributes.nodes.find(
                  (item) => item.name === subVariant?.name,
                )?.value,
            )

          const variantOptions =
            variation.attributes.nodes[1]?.options.map((item) => ({
              id: item,
              name: item,
              value: item,
              isInStock: inStockSubVariantOptions.includes(item),
              isActive:
                item === product.attributes.nodes[1]?.value &&
                inStockSubVariantOptions.includes(item),
            })) ?? null

          const quantityOptions = getQuantityOptions(
            product.stockQuantity,
            cartItemRecord.quantity,
          )

          acc.push({
            type: "VARIATION",
            id: cartItemRecord.id,
            key: cartItemRecord.key,
            name: product.name,
            image: product.image,
            price: (
              parseInt(product.price) * cartItemRecord.quantity
            ).toString(),
            regularPrice: product.regularPrice,
            stockQuantity: product.stockQuantity,
            stockStatus: product.stockStatus,
            attributes: product.attributes,
            quantity: cartItemRecord.quantity,
            quantityOptions: quantityOptions,
            hasSelectedQuantity:
              !!quantityOptions.find((option) => option.isActive) ||
              quantityOptions.length === 0,
            variantOptions: variantOptions,
            selectedVariant: product.attributes.nodes[1]
              ? product.attributes.nodes[1].value
              : null,
            hasSelectedVariant: !!variantOptions?.find(
              (option) => option.isActive,
            ),
            isInStock: !!variantOptions?.find((item) => item.isInStock),
            tax: calculateGst(
              extractPrice(product.price) * cartItemRecord.quantity,
              product.taxClass,
            ),
            error: null,
          })
        }
      }

      return acc
    },
    [],
  )

  return filteredProducts
}

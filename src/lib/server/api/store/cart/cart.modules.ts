import {
  ADD_MULTIPLE_CART_ITEMS,
  ADD_TO_CART,
  GET_CART,
  GET_CART_FOR_MERGED_CART,
  GET_CART_ITEMS,
  GET_CART_ITEMS_COUNT,
  GET_PRODUCT_STOCK_STATUS,
  GET_VARIATION_STOCK_DETAILS,
  REMOVE_CART_ITEM,
  REPLACE_CART_ITEM,
  UPDATE_CART_ITEM_QUANTITY,
} from "./cart.gql"
import { uniq } from "lodash-es"
import { TRPCError } from "@trpc/server"
import { filterProductsByCartItemRecords } from "~/lib/utils/functions/filter-products-by-cart-item-records"
import { encodeVariableIds } from "~/lib/utils/functions/encode-variable-ids"
import { doesTextContains } from "~/lib/utils/functions/does-text-contains"
import { decodeBase64Id } from "~/lib/utils/functions/decodeBase64Id"
import { decodeVariableIds } from "~/lib/utils/functions/decode-variable-ids"
import { type AddToCartDTOType, type ReplaceItemDTOType } from "./cart.dtos"
import { persistedCartStoreModules } from "../../../../modules/cart/cart-methods"
import { session } from "~/lib/utils/functions/session"
import { calculateCodCharges } from "~/lib/utils/functions/calculate-cod-charges"
import { type TrpcContext } from "~/lib/trpc/trpc-context"
import { type Coupon } from "~/lib/modules/coupon/utils/coupon-types"

export const getCart = async (props: TrpcContext) => {
  if (!props.session) {
    const { persistedItems } = persistedCartStoreModules()

    const cartItemRecords = persistedItems()

    if (!cartItemRecords) return null

    const { cartItems } = await getProductsByCartItemRecords(cartItemRecords)

    const summary: OfflineSummary = summaryCalculator({
      type: "OFFLINE",
      cartItems: cartItems,
    })

    return {
      summary,
      cartItems,
    }
  }

  await syncStore(props.session.authToken)

  const syncedItemsResponse = await getSyncedItems(props.session.authToken)

  if (!syncedItemsResponse) return null

  const { cartItems } = syncedItemsResponse

  const summary: OfflineSummary = summaryCalculator({
    type: "OFFLINE",
    cartItems: cartItems,
  })

  return {
    summary,
    cartItems,
  }
}

export const updateQuantity = async (
  props: TrpcContext<UpdateQuantityInputProps>,
) => {
  if (!props.session) {
    const { updatePersistedItemQuantity } = persistedCartStoreModules()

    updatePersistedItemQuantity(props.key, props.quantity)

    return true
  }

  await updateSyncedItemQuantity(props.session.authToken, props)

  return true
}

export const switchVariation = async (props: TrpcContext<ReplaceItem>) => {
  if (!props.session) {
    const { replacePersistedItem } = persistedCartStoreModules()

    await replacePersistedItem({
      id: props.id,
      key: props.key,
      quantity: props.quantity,
      currentBaseAttribute: props.currentBaseAttribute,
      selectedAttribute: props.selectedAttribute,
    })

    return true
  }

  await replaceSyncedItem(props.session.authToken, {
    id: props.id,
    key: props.key,
    quantity: props.quantity,
    currentBaseAttribute: props.currentBaseAttribute,
    selectedAttribute: props.selectedAttribute,
  })

  return true
}

export const removeCartItems = async (
  props: TrpcContext<SyncedCartItemsInput>,
) => {
  if (!props.session) {
    const { removePersistedItem } = persistedCartStoreModules()

    removePersistedItem(props.keys[0]!)

    return true
  }

  await removeItemFromSyncedStore(props)

  return true
}

export const getSyncedItems = async (authToken: string) => {
  const cartResponse = await userQuery<{
    cart: {
      contents: {
        nodes: UserCartProduct[]
      }
    }
    customer: {
      shipping: {
        postcode: string
        state: string
        city: string
      }
    }
  }>(GET_CART, {}, authToken, "no-cache")

  if (cartResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    })
  }

  if (cartResponse.data.cart.contents.nodes.length === 0) {
    return null
  }

  if (!cartResponse.data.cart) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Your cart is empty",
    })
  }

  const items: CartItemRecord[] = cartResponse.data.cart.contents.nodes.map(
    (item) => {
      if (item.variation !== null) {
        return {
          id: encodeVariableIds(item.product.node.id, item.variation.node.id),
          key: item.key,
          quantity: item.quantity,
          variants: true,
        }
      }

      return {
        id: item.product.node.id,
        key: item.key,
        quantity: item.quantity,
        variants: false,
      }
    },
  )

  const data: CartProduct[] = cartResponse.data.cart.contents.nodes
    .map((item) => item.product.node)
    .reduce<CartProduct[]>((acc, item) => {
      const exist = acc.find((product) => product.id === item.id)

      if (!exist) acc.push(item)

      return acc
    }, [])

  const cartItems = filterProductsByCartItemRecords(
    items,
    data,
    cartResponse.data.customer,
  )

  return { cartItems, items }
}

export const addItemToSyncedStore = async (
  authToken: string,
  input: AddToCartDTOType,
) => {
  const product = await getProductStockDetailsByProductId(
    input.parentDataBaseId,
  )

  if (input.type === "SIMPLE" && product.type === "SIMPLE") {
    const { stockStatus, stockQuantity } = product

    if (stockStatus === "OUT_OF_STOCK" || stockQuantity === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The product just got out of stock.",
      })
    }

    const response = await userQuery<{
      addToCart: { cartItem: { key: string; quantity: number } }
    }>(
      ADD_TO_CART,
      {
        productId: input.parentDataBaseId,
        quantity: input.requestedQuantity,
      },
      authToken,
      "no-cache",
    )

    if (
      response.error &&
      doesTextContains(response.error, "You cannot add that amount to the cart")
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested quantity exceeds the available stock.",
      })
    }

    if (response.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      })
    }

    if (response.data.addToCart.cartItem.quantity > 10) {
      await updateSyncedItemQuantity(authToken, {
        key: response.data.addToCart.cartItem.key,
        quantity: 10,
      })

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested quantity exceeds the available stock.",
      })
    }

    return true
  }

  if (input.type === "VARIABLE" && product.type === "VARIABLE") {
    const { variations } = product

    const variation = findVariationStockDetailsByVariationId(
      variations.nodes,
      input.variationDataBaseId,
    )

    const { stockStatus, stockQuantity } = variation

    if (stockStatus === "OUT_OF_STOCK" || stockQuantity === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The product just got out of stock.",
      })
    }

    const response = await userQuery<{
      addToCart: { cartItem: { key: string; quantity: number } }
    }>(
      ADD_TO_CART,
      {
        productId: input.variationDataBaseId,
        quantity: input.requestedQuantity,
      },
      authToken,
      "no-cache",
    )

    if (
      response.error &&
      doesTextContains(response.error, "You cannot add that amount to the cart")
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Sorry, we don't have enough stock yet.",
      })
    }

    if (response.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      })
    }

    if (response.data.addToCart.cartItem.quantity > 10) {
      await updateSyncedItemQuantity(authToken, {
        key: response.data.addToCart.cartItem.key,
        quantity: 10,
      })

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Requested quantity exceeds the available stock.",
      })
    }

    return true
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong.",
  })
}

export const removeItemFromSyncedStore = async (
  props: TrpcContext<SyncedCartItemsInput>,
) => {
  if (!props.session) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Not logged in." })
  }

  const removeItemResponse = await userQuery<{
    removeItemsFromCart: { cart: { contents: { nodes: { key: string }[] } } }
  }>(
    REMOVE_CART_ITEM,
    {
      keys: props.keys,
      all: props.isAll,
    },
    props.session.authToken,
    "no-cache",
  )

  if (removeItemResponse.error) {
    throw new TRPCError({ code: "BAD_REQUEST" })
  }

  return true
}

export const replaceSyncedItem = async (
  authToken: string,
  input: ReplaceItemDTOType,
) => {
  const parentDatabaseId = parseInt(
    decodeBase64Id(decodeVariableIds(input.id).parentId),
  )

  type Response = {
    product: {
      id: string
      variations: {
        nodes: {
          id: string
          stockQuantity: number
          stockStatus: string
          attributes: {
            nodes: VariationAttribute[]
          }
        }[]
      }
    }
  }

  const variationResponse = await adminQuery<Response>(
    GET_VARIATION_STOCK_DETAILS,
    {
      id: parentDatabaseId,
    },
    "no-cache",
  )

  if (variationResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    })
  }

  const variations = variationResponse.data.product.variations.nodes

  const variation = variations.find(
    (v) =>
      v.attributes.nodes.some(
        (a) =>
          a.name === input.currentBaseAttribute.name &&
          a.value === input.currentBaseAttribute.value,
      ) &&
      v.attributes.nodes.some(
        (a) =>
          a.name === input.selectedAttribute.name &&
          a.value === input.selectedAttribute.value,
      ),
  )

  if (!variation) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product is not available",
    })
  }

  if (variation.stockStatus === "OUT_OF_STOCK") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Product got out of stock",
    })
  }

  const cartItemResponse = await userQuery(
    REPLACE_CART_ITEM,
    {
      keys: [input.key],
      productId: parseInt(decodeBase64Id(variation.id)),
      quantity: Math.min(input.quantity, variation.stockQuantity),
    },
    authToken,
    "no-cache",
  )

  if (cartItemResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    })
  }

  return true
}

export const findVariationStockDetailsByVariationId = (
  variations: StockVariation[],
  variationDataBaseId: number,
) => {
  const variation = variations.find(
    (item) => item.databaseId === variationDataBaseId,
  )

  if (!variation) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Product not found.",
    })
  }

  return variation
}

/* 
  
Space -_-
  
*/

export const getProductsByCartItemRecords = async (items: CartItemRecord[]) => {
  const cartResponse = await adminQuery<{ products: { nodes: CartProduct[] } }>(
    GET_CART_ITEMS,
    {
      include: sortProductParentIdsFromCartItemRecords(items),
    },
    "no-cache",
  )

  if (cartResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    })
  }

  const cartItems = filterProductsByCartItemRecords(
    items,
    cartResponse.data.products.nodes,
  )

  return {
    cartItems,
    data: cartResponse.data.products.nodes,
  }
}

/* 
  
Space -_-
  
*/

export const sortProductParentIdsFromCartItemRecords = (
  items: CartItemRecord[],
) => {
  const variablesIds = uniq(
    items
      .filter((item) => item.variants)
      .map((item) =>
        parseInt(decodeBase64Id(decodeVariableIds(item.id).parentId ?? "")),
      ),
  )

  const simpleProductIds = items
    .filter((item) => !item.variants)
    .map((item) => parseInt(decodeBase64Id(item.id)))

  return [...variablesIds, ...simpleProductIds]
}

/* 
  
Space -_-
  
*/

export const summaryCalculator = <T extends Summary>(props: SummaryProps) => {
  if (props.type === "OFFLINE") {
    const mrpTotal = props.cartItems.reduce<number>(
      (acc, cartItem) => acc + +cartItem.regularPrice * cartItem.quantity,
      0,
    )

    const totalSalePrice = props.cartItems.reduce<number>(
      (acc, cartItem) => acc + parseInt(cartItem.price),
      0,
    )

    return {
      type: "OFFLINE",
      mrpTotal: mrpTotal,
      cartDiscount: mrpTotal - totalSalePrice,
      subtotal: totalSalePrice,
      total: totalSalePrice,
    } satisfies OfflineSummary as T
  }

  if (props.type === "ONLINE") {
    const mrpTotal = props.cartContents.reduce<number>((acc, item) => {
      return acc + +item.product.node.regularPrice * item.quantity
    }, 0)

    const appliedCoupon = calculateCouponDiscount(
      props.appliedCoupon,
      +props.total,
    )

    const appliedWalletBalance = props.appliedWalletBalance
      ? Math.min(
          props.appliedWalletBalance,
          +props.subtotal - (appliedCoupon?.couponDiscount ?? 0),
        )
      : null

    return {
      type: "ONLINE",
      mrpTotal: mrpTotal,
      cartDiscount: mrpTotal - +props.subtotal,
      coupon: appliedCoupon,
      walletTotal: appliedWalletBalance,
      subtotal: +props.subtotal,
      oldTotal: +props.total,
      finalTotal:
        +props.total -
        (appliedWalletBalance ?? 0) -
        (appliedCoupon?.couponDiscount ?? 0),
      shippingTotal: +props.shippingTotal ?? null,
      codCharges: calculateCodCharges(+props.subtotal),
    } satisfies OnlineSummary as T
  }

  throw new Error("Invalid summary type")
}

export const calculateCouponDiscount = (
  coupon: Coupon | null,
  total: number,
): CalculatedDiscount | null => {
  if (!coupon) return null

  if (coupon.discountType === "FIXED_CART") {
    return {
      couponCode: coupon.code,
      couponDiscount: Math.min(total, coupon.amount),
      type: coupon.discountType,
    }
  }

  if (coupon.discountType === "PERCENT") {
    const couponDiscountRate = coupon.amount / 100

    const discountAmount = couponDiscountRate * total

    return {
      couponCode: coupon.code,
      couponDiscount: Math.min(total, discountAmount),
      type: coupon.discountType,
    }
  }

  return null
}

/* 
  
Space -_-
  
*/

type GetCartIndicatorInputProps = {
  isLoggedIn: boolean
} & ({ isLoggedIn: true; authToken: string } | { isLoggedIn: false })

export const syncStore = async (authToken: string) => {
  const { persistedItems, clearPersistedStore } = persistedCartStoreModules()

  const cartItemRecords = persistedItems()

  if (cartItemRecords === null) {
    return
  }

  const mergeQueryDataResponse = await userQuery<{
    cart: {
      contents: { nodes: MergeQueryItem[] }
    }
  }>(GET_CART_FOR_MERGED_CART, {}, authToken, "no-cache")

  const data = mergeQueryDataResponse.data.cart.contents.nodes

  if (mergeQueryDataResponse.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    })
  }

  const itemsToMerge = cartItemRecords.reduce<UserCartItemRecord[]>(
    (acc, item) => {
      if (!item.variants) {
        const existingItem = data
          .filter((f) => f.variation === null)
          .find((cartItem) => cartItem.product.node.id === item.id)

        const getQuantity = () => {
          if (!existingItem) return item.quantity

          const stockQuantity = existingItem.product.node.stockQuantity

          const maxedOutQuantity =
            existingItem.product.node.stockQuantity - existingItem.quantity

          const totalQuantity = item.quantity + existingItem.quantity

          if (totalQuantity >= stockQuantity) {
            return maxedOutQuantity
          }

          return item.quantity
        }

        acc.push({
          productId: parseInt(decodeBase64Id(item.id)),
          quantity: getQuantity(),
        })

        return acc
      }

      if (item.variants) {
        const existingItem = data
          .filter((f) => f.variation !== null)
          .find(
            (cartItem) =>
              cartItem.variation!.node.id ===
              decodeVariableIds(item.id).variationId,
          )

        const getQuantity = () => {
          if (!existingItem) return item.quantity

          const stockQuantity = existingItem.variation!.node.stockQuantity

          const maxedOutQuantity =
            existingItem.variation!.node.stockQuantity - existingItem.quantity

          const totalQuantity = item.quantity + existingItem.quantity

          if (totalQuantity >= stockQuantity) {
            return maxedOutQuantity
          }

          return item.quantity
        }

        acc.push({
          productId: parseInt(
            decodeBase64Id(decodeVariableIds(item.id).variationId),
          ),
          quantity: getQuantity(),
        })

        return acc
      }

      return acc
    },
    [],
  )

  await userQuery<{
    addCartItems: { cartErrors: { productId: string; reasons: string[] }[] }
  }>(
    ADD_MULTIPLE_CART_ITEMS,
    {
      items: itemsToMerge,
    },
    authToken,
    "no-cache",
  )

  clearPersistedStore()
}

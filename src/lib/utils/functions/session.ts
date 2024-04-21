import { type SessionCartTotals } from "~/lib/modules/checkout/checkout-types"
import metaFinder from "./meta-finder"

export const session = {
  cart: {
    parse: (sessionData: MetaData[], errorMessage?: string): LineItem[] => {
      const items = metaFinder.safeParse<SessionCartItemRecord>({
        metaData: sessionData,
        key: "cart",
      })

      if (!items) throw new Error(errorMessage ?? "Cart is empty")

      const values = Object.values(items)

      const lineItems: LineItem[] = values.map((a) => ({
        product_id: a.product_id,
        quantity: a.quantity,
        ...(a.variation ? { variation_id: a.variation_id } : {}),
      }))

      return lineItems
    },
    safeParse: (sessionData: MetaData[]): LineItem[] | null => {
      const items = metaFinder.safeParse<SessionCartItemRecord>({
        metaData: sessionData,
        key: "cart",
      })

      if (!items) return null

      const values = Object.values(items)

      const lineItems: LineItem[] = values.map((a) => ({
        product_id: a.product_id,
        quantity: a.quantity,
        ...(a.variation ? { variation_id: a.variation_id } : {}),
      }))

      return lineItems
    },
  },

  cartTotals: {
    safeParse: (sessionData: MetaData[]): SessionCartTotals | null => {
      const totals = metaFinder.safeParse<SessionCartTotals>({
        metaData: sessionData,
        key: "cart_totals",
      })

      if (!totals) return null

      return totals
    },
    parse: (
      sessionData: MetaData[],
      errorMessage?: string,
    ): SessionCartTotals => {
      const totals = metaFinder.safeParse<SessionCartTotals>({
        metaData: sessionData,
        key: "cart_totals",
      })

      if (!totals) throw new Error(errorMessage ?? "Cart totals not found")

      return totals
    },
  },

  appliedCoupon: {
    parse: (sessionData: MetaData[], errorMessage?: string): AppliedCoupon => {
      const coupons = metaFinder.safeParse<Record<string, number>>({
        metaData: sessionData,
        key: "coupon_discount_totals",
      })

      if (!coupons) throw new Error(errorMessage ?? "No coupons applied")

      const couponsArray: AppliedCoupon[] = Object.keys(coupons).map((key) => ({
        code: key,
        discountAmount: coupons[key]!.toString(),
        date: Date.now().toString(),
      }))

      const coupon = couponsArray[0]

      if (!coupon) throw new Error(errorMessage ?? "No coupons applied")

      return coupon
    },
    safeParse: (sessionData: MetaData[]): AppliedCoupon | null => {
      const coupons = metaFinder.safeParse<Record<string, number>>({
        metaData: sessionData,
        key: "coupon_discount_totals",
      })

      if (!coupons) return null

      const couponsArray: AppliedCoupon[] = Object.keys(coupons).map((key) => ({
        code: key,
        discountAmount: coupons[key]!.toString(),
        date: Date.now().toString(),
      }))

      const coupon = couponsArray[0]

      if (!coupon) return null

      return coupon
    },
  },

  appliedWallet: {
    parse: (sessionData: MetaData[], errorMessage?: string): boolean => {
      const wallet = metaFinder.safeParse<boolean>({
        metaData: sessionData,
        key: "applied_wallet",
      })

      if (!wallet) throw new Error(errorMessage ?? "No wallet applied")

      return wallet
    },
    safeParse: (sessionData: MetaData[]): boolean => {
      const wallet = metaFinder.safeParse<boolean>({
        metaData: sessionData,
        key: "applied_wallet",
      })

      if (!wallet) return false

      return wallet
    },
  },

  selectedShippingMethod: {
    parse: (
      sessionData: MetaData[],
      errorMessage?: string,
    ): SelectedShippingMethod => {
      const shippingMethods = metaFinder.safeParse<string[]>({
        metaData: sessionData,
        key: "chosen_shipping_methods",
      })

      if (!shippingMethods || shippingMethods.length === 0)
        throw new Error(errorMessage ?? "No shipping method selected")

      const regex = /\bfree\b/i

      const freeShipping = shippingMethods.find((method) => regex.test(method))

      return {
        methodId: shippingMethods[0]!,
        isFree: !!freeShipping,
      }
    },
    safeParse: (sessionData: MetaData[]): SelectedShippingMethod | null => {
      const shippingMethods = metaFinder.safeParse<string[]>({
        metaData: sessionData,
        key: "chosen_shipping_methods",
      })

      if (!shippingMethods || shippingMethods.length === 0) return null

      const regex = /\bfree\b/i

      const freeShipping = shippingMethods.find((method) => regex.test(method))

      return {
        methodId: shippingMethods[0]!,
        isFree: !!freeShipping,
      }
    },
  },
}

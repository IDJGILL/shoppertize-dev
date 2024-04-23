import { TRPCError } from "@trpc/server"
import { type MainCartItem } from "../cart/cart-types"
import type { PaymentMethod } from "../payment/payment-types"
import { redisClient } from "~/lib/redis/redis-client"
import type { PaymentOption, CheckoutSession } from "./checkout-types"
import { payment } from "../payment/payment-methods"
import { type Session } from "next-auth"
import { cart, summary } from "../cart/cart-methods"
import { address } from "../address/utils/address-methods"
import { wrapTRPC } from "~/lib/trpc/trpc-instance"
import { nanoid } from "nanoid"
import { order } from "../order/utils/order-methods"

const COD_CHARGES = 50 // Todo - Move this to app config

export const checkout = {
  get: async (props: { session: Session }) => {
    const { session } = props

    const requests = await Promise.all([
      payment.wallet.get({
        email: session.user.email,
      }),
      cart.method.get(session),
      address.get.both(props.session),
    ])

    const wallet = requests[0]

    const cartItems = requests[1]

    const shippingAddress = requests[2].shipping

    checkout.validate({ items: cartItems.data })

    const walletBalance = wallet.data.balance.amount

    const cartTotals = summary.calc({
      items: cartItems.data,
      additionalCharges: [],
      additionalDiscounts: [],
    })

    const hasNoCodDeliveryItems = cartItems.data.some((a) => !a.hasCashOnDelivery)

    const paymentOptions = [
      {
        type: "ONLINE",
        label: "Online",
        description: "UPI/Credit/Debit/NET Banking",
        isEligible: true,
      },
      {
        type: "WALLET",
        label: "Wallet",
        description: `Current Balance: ${wallet.data.balance.amount}`,
        isEligible: wallet.data.balance.amount !== 0,
      },
      {
        type: "COD",
        label: "Cash on Delivery",
        description: hasNoCodDeliveryItems
          ? "Cash on Delivery is not available."
          : `Addition ${COD_CHARGES} Cash handling charges will be applicable.`,
        isEligible: !hasNoCodDeliveryItems,
        charges: COD_CHARGES,
      },
    ] satisfies PaymentOption[]

    return {
      cartTotals,
      paymentOptions,
      shippingAddress,
      walletBalance,
    }
  },

  handle: async (props: { paymentMethod: PaymentMethod; session: Session }) => {
    return wrapTRPC<{ url: string }, "none">(async (response) => {
      const { referenceId } = await checkout.session.create({
        user: {
          id: props.session.user.id,
          email: props.session.user.email,
        },
        paymentMethod: props.paymentMethod,
      })

      // Also need applied coupon details if any.

      switch (props.paymentMethod) {
        case "ONLINE": {
          const req = await payment.gateway.phonepe.init({
            amount: 1000,
            referenceId,
          })

          return response.success({
            action: "none",
            data: { url: req.data.url },
          })
        }

        case "WALLET": {
          // Place order because user have enough balance
          // ...

          // Debit wallet before placing order and refund if fails
          // ...

          return response.success({
            action: "none",
            data: { url: "" },
          })
        }

        case "COD": {
          const id = await order.handle({ referenceId })

          return response.success({
            action: "none",
            data: { url: `/checkout/order?referenceId=${id}` },
          })
        }
      }
    })
  },

  validate: (props: { items: MainCartItem[]; paymentMethod?: PaymentMethod }) => {
    const isCartEmpty = props.items.length === 0

    if (isCartEmpty) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Cart is empty.",
      })
    }

    const hasErrors = props.items.some((a) => !!a.error?.errorEnum)

    if (hasErrors) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Cart Contains Items with Issues: Please resolve them before proceeding.",
      })
    }

    const hasNoCodDeliveryItems = props.items.some((a) => !a.hasCashOnDelivery)

    if (props.paymentMethod === "COD" && hasNoCodDeliveryItems) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unable to Use Cash on Delivery: Some items in your cart are not eligible for Cash on Delivery.",
      })
    }
  },

  session: {
    create: async (payload: Omit<CheckoutSession, "referenceId" | "createdAt">) => {
      const randomString = nanoid(16)
      const recordId = `$checkout/session${randomString}`

      const data = {
        ...payload,
        referenceId: randomString,
        createdAt: Date.now().toString(),
      } satisfies CheckoutSession

      const response = await redisClient.json.set(recordId, "$", data)

      if (response !== "OK") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      await redisClient.expire(recordId, 3600)

      return data
    },

    get: async (id: string) => {
      const recordId = `$checkout/session${id}`

      const response = (await redisClient.json.get(recordId)) as CheckoutSession | null

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      return response
    },

    update: async (props: {
      id: string
      payload: Partial<Omit<CheckoutSession, "referenceId" | "createdAt" | "user">>
    }) => {
      const recordId = `$checkout/session${props.id}`

      const requests: Promise<"OK" | null>[] = []

      Object.entries(props.payload).forEach(([key, value]) => {
        if (typeof value === "string") {
          return requests.push(redisClient.json.set(recordId, ["$", key].join("."), `"${value}"`))
        }

        requests.push(redisClient.json.set(recordId, ["$", key].join("."), value))
      })

      const responses = await Promise.all(requests)

      if (responses.some((a) => a !== "OK")) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    },
  },
}

export const coupon = {}

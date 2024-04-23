import "server-only"

import { nanoid } from "nanoid"
import { redisClient } from "~/vertex/lib/redis/client"
import type { CheckoutSession, FeeLine, OrderBillingProps, OrderProps, OrderShippingProps } from "./checkout-types"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { getAuthSession } from "../auth/auth-server-utils"
import { getWallet } from "../payment/payment-controllers"
import type { MainCartItem } from "../cart/cart-types"
import type { PaymentMethod } from "../payment/payment-types"
import { calcSummary } from "../cart/cart-client-utils"
import { config } from "~/vertex/global/config"
import { validateCartItems } from "./checkout-shared-utils"
import { wooClient } from "~/vertex/lib/wordpress/woocommerce-client"
import { sortCartItemsData } from "../cart/cart-server-utils"

export const checkoutSession = {
  create: async (payload: Omit<CheckoutSession, "referenceId" | "checkoutOutAt">) => {
    const randomString = nanoid(16)

    const recordId = `$checkout/session${randomString}`

    const data = {
      ...payload,
      referenceId: randomString,
      checkoutOutAt: Date.now().toString(),
    } satisfies CheckoutSession

    const response = await redisClient.set(recordId, data)

    if (response !== "OK") throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })

    await redisClient.expire(recordId, 3600)

    return data
  },

  get: async (uid: string) => {
    const recordId = `$checkout/session${uid}`

    const requests = await Promise.all([redisClient.get<CheckoutSession>(recordId), getAuthSession(uid)])

    const checkoutSession = requests[0]

    const authSession = requests[1]

    if (!checkoutSession || !authSession?.currentAddress) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })

    return { ...checkoutSession, ...authSession, currentAddress: authSession.currentAddress }
  },

  //   update: async (props: {
  //     id: string
  //     payload: Partial<Omit<CheckoutSession, "referenceId" | "createdAt" | "user">>
  //   }) => {
  //     const recordId = `$checkout/session${props.id}`

  //     const requests: Promise<"OK" | null>[] = []

  //     Object.entries(props.payload).forEach(([key, value]) => {
  //       if (typeof value === "string") {
  //         return requests.push(redisClient.json.set(recordId, ["$", key].join("."), `"${value}"`))
  //       }

  //       requests.push(redisClient.json.set(recordId, ["$", key].join("."), value))
  //     })

  //     const responses = await Promise.all(requests)

  //     if (responses.some((a) => a !== "OK")) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })
  //   },
}

export async function saveOrderToDatabase(referenceId: string): Promise<{ orderId: string }> {
  const {
    uid,
    items,
    username,
    paymentMethod,
    currentAddress: {
      address: { shipping: shippingData, billing: billingData },
    },
  } = await checkoutSession.get(referenceId)

  const cartItems = sortCartItemsData({
    cartItems: items,
    postcode: shippingData.postcode,
  })

  const lineItems = cartItems.map((a) => ({ product_id: a.id, quantity: a.quantity }))

  const feeLines = await getFeeLines({ items: cartItems, paymentMethod, username })

  const shipping = {
    first_name: shippingData.firstName,
    last_name: shippingData.lastName,
    phone: shippingData.phone,
    postcode: shippingData.postcode,
    city: shippingData.city,
    state: shippingData.state,
    country: shippingData.country,
    address_1: shippingData.address1,
    address_2: shippingData.address2,
  } satisfies OrderShippingProps

  const billing = {
    first_name: billingData?.firstName ?? shippingData.firstName,
    last_name: billingData?.lastName ?? shippingData.lastName,
    email: billingData?.email ?? shippingData.email,
    phone: billingData?.phone ?? shippingData.phone,
    postcode: billingData?.postcode ?? shippingData.postcode,
    city: billingData?.city ?? shippingData.city,
    state: billingData?.state ?? shippingData.state,
    country: billingData?.country ?? shippingData.country,
    address_1: billingData?.address1 ?? shippingData.address1,
    address_2: billingData?.address2 ?? shippingData.address2,
    company: billingData?.company ?? "", // Todo
  } satisfies OrderBillingProps

  const order: OrderProps = {
    customer_id: +uid,
    status: "processing",
    payment_method: "online",
    set_paid: false,
    shipping,
    billing,
    line_items: lineItems,
    fee_lines: feeLines,
    meta_data: [],
  }

  switch (paymentMethod) {
    case "ONLINE": {
      order.payment_method = "online"

      order.set_paid = true

      order.meta_data.push({ key: "transaction_reference_id", value: referenceId })

      break
    }

    case "WALLET": {
      validateCartItems({ items: cartItems, paymentMethod: "WALLET" })

      order.payment_method = "online"

      order.set_paid = true

      break
    }

    case "COD": {
      validateCartItems({ items: cartItems, paymentMethod: "COD" })

      order.payment_method = "cod"

      order.set_paid = false

      break
    }
  }

  const response = await wooClient<{ id: number }>({
    method: "POST",
    path: "orders",
    data: order,
    cacheConfig: "no-cache",
  })

  return { orderId: response.id.toString() }
}

async function getFeeLines(props: { username: string; items: MainCartItem[]; paymentMethod: PaymentMethod }) {
  const fee: FeeLine[] = [] as FeeLine[]

  const cartTotals = calcSummary({ items: props.items })

  switch (props.paymentMethod) {
    case "COD": {
      const codChanges = Math.round(
        config.payment.codCharges.type === "percentage"
          ? (config.payment.codCharges.amount / 100) * cartTotals.total
          : config.payment.codCharges.amount,
      )

      fee.push({ name: "COD Fee", total: codChanges.toString(), tax_status: "none" })
    }

    case "WALLET": {
      const wallet = await getWallet(props.username)

      // const walletSpend = Math.min(props.wallet.amount, cartTotals.total)
      // fee.push({
      //   name: "Wallet",
      //   total: "-" + walletSpend.toString(),
      //   tax_status: "none",
      // })
    }
  }

  fee.push({ name: "Shipping", total: "50", tax_status: "none" })

  return fee
}

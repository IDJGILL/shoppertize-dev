import "server-only"

import { getWallet, phonePayPagePage } from "../payment/payment-controllers"
import { getCurrentAddressFromSession } from "../address/address-server-utils"
import { getCartItemData, sortCartItemsData } from "../cart/cart-server-utils"
import { validateCartItems } from "./checkout-shared-utils"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { calcSummary } from "../cart/cart-client-utils"
import type { PaymentMethod, PaymentOption } from "../payment/payment-types"
import { checkoutSession, saveOrderToDatabase } from "./checkout-server-utils"

const COD_CHARGES = 50 // Todo - Move this to app config

export const getCheckoutSession = async (uid: string, email: string) => {
  const requests = await Promise.all([getWallet(email), getCartItemData(), getCurrentAddressFromSession(uid)])

  const wallet = requests[0]

  const cartItems = requests[1]

  const shippingAddress = requests[2]?.address.shipping

  if (!shippingAddress) {
    throw new ExtendedError({ code: "BAD_REQUEST" })
  }

  const items = sortCartItemsData({ cartItems, postcode: shippingAddress.postcode })

  validateCartItems({ items })

  const walletBalance = wallet.balance.amount

  const cartTotals = calcSummary({ items })

  const hasNoCodDeliveryItems = items.some((a) => !a.hasCashOnDelivery)

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
      description: `Current Balance: ${walletBalance}`,
      isEligible: walletBalance !== 0,
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
}

export const checkoutHandler = async (method: PaymentMethod) => {
  const { referenceId } = await checkoutSession.create({ items: await getCartItemData(), paymentMethod: method })

  // Also need applied coupon details if any.

  switch (method) {
    case "ONLINE": {
      const data = await phonePayPagePage()

      return { url: data.url }
    }

    case "WALLET": {
      // Place order because user have enough balance
      // ...

      // Debit wallet before placing order and refund if fails
      // ...

      return { url: "" }
    }

    case "COD": {
      const data = await saveOrderToDatabase(referenceId)

      return {
        action: "none",
        data: { url: `/checkout/order?referenceId=${data.orderId}` },
      }
    }
  }
}

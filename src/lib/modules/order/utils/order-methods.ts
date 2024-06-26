import { woocommerce } from "~/lib/server/access/woocommerce"
import type { MainCartItem } from "../../cart/cart-types"
import type { FeeLine, LineItem } from "./order-types"
import type { PaymentMethod, WalletBalance } from "../../payment/payment-types"
import appConfig from "app.config"
import { cart, summary } from "../../cart/cart-methods"
import { checkout } from "../../checkout/checkout-methods"
import { address } from "../../address/utils/address-methods"
import { payment } from "../../payment/payment-methods"
import { authorize } from "../../auth/auth-methods"
import type {
  BillingAddress,
  ShippingAddress,
} from "../../address/utils/address-types"
import { findState } from "~/lib/utils/functions/find-state-by-value"

export const order = {
  handle: async (props: { referenceId: string }) => {
    const data = await order.helper.data(props)

    const response = await woocommerce<{ id: number }>(
      "POST",
      "orders",
      data,
      "no-cache",
    )

    return response.id
  },
  helper: {
    data: async (props: { referenceId: string }) => {
      const checkoutSession = await checkout.session.get(props.referenceId)

      const { user, paymentMethod } = checkoutSession

      const { authToken } = await authorize.tokens(user.email)

      const requests = await Promise.all([
        cart.method.get({ authToken }),
        address.get.both({ authToken }),
        payment.wallet.get({ email: user.email }),
      ])

      const items = requests[0].data

      const addresses = requests[1]

      const wallet = requests[2].data.balance

      const lineItems = order.helper.itemLines(items)

      const feeLines = order.helper.feeLines({
        items,
        wallet,
        paymentMethod,
      })

      const shippingAddress = order.helper.format.shipping(addresses.shipping)

      const billingAddress = order.helper.format.billing(addresses.billing)

      const data: OrderProps = {
        customer_id: +user.id,
        status: "processing",
        payment_method: "online",
        set_paid: false,
        shipping: shippingAddress,
        billing: billingAddress,
        line_items: lineItems,
        fee_lines: feeLines,
        meta_data: [],
      }

      switch (paymentMethod) {
        case "ONLINE": {
          data.payment_method = "online"

          data.set_paid = true

          data.meta_data.push({
            key: "transaction_reference_id",
            value: props.referenceId,
          })

          return data
        }

        case "WALLET": {
          checkout.validate({ items, paymentMethod: "COD" })

          data.payment_method = "online"

          data.set_paid = true

          return data
        }

        case "COD": {
          checkout.validate({ items, paymentMethod: "COD" })

          data.payment_method = "cod"

          data.set_paid = false

          return data
        }
      }
    },

    itemLines: (items: MainCartItem[]): LineItem[] => {
      return items.map((a) => ({
        product_id: a.id,
        quantity: a.quantity,
      }))
    },

    feeLines: ,

    format: {
      shipping: (address: ShippingAddress) => {
        return {
          first_name: address.firstName!,
          last_name: address.lastName!,
          phone: address.phone!,
          postcode: address.postcode!,
          city: address.city!,
          state: findState({
            value: address.state!,
            valueType: "name",
            returnType: "code",
          })!,
          country: address.country!,
          address_1: address.address1!,
          address_2: address.address2!,
        } satisfies OrderShippingProps
      },

      billing: (address: BillingAddress) => {
        return {
          first_name: address.firstName!,
          last_name: "",
          phone: address.phone!,
          postcode: address.postcode!,
          city: address.city!,
          state: findState({
            value: address.state!,
            valueType: "name",
            returnType: "code",
          })!,
          country: address.country!,
          address_1: address.address1!,
          address_2: address.address2!,
          company: address.company!,
          email: address.email!,
        } satisfies OrderBillingProps
      },
    },
  },
}


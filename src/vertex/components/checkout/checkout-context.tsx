"use client"

import { useRouter } from "next/router"
import { createContext, useContext, useState } from "react"
import { checkoutAction } from "~/vertex/lib/action/actions"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { type checkoutSessionQuery } from "~/vertex/modules/checkout/checkout-queries"
import { type PaymentMethod } from "~/vertex/modules/payment/payment-types"

export const CheckoutContext = createContext<ReturnType<typeof useCheckoutContextLogic> | null>(null)

interface CheckoutContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  data: Awaited<ReturnType<typeof checkoutSessionQuery>>
}

export function CheckoutContextProvider({ ...props }: CheckoutContextProviderProps) {
  const { data } = props

  return <CheckoutContext.Provider value={useCheckoutContextLogic(data)}>{props.children}</CheckoutContext.Provider>
}

function useCheckoutContextLogic(initialData: Awaited<ReturnType<typeof checkoutSessionQuery>>) {
  const [paymentMethod, paymentMethodSet] = useState<PaymentMethod>("ONLINE")

  const router = useRouter()

  const checkout = useActionHandler(checkoutAction, {
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const { cartTotals, walletBalance, paymentOptions } = initialData

  const walletAmount = paymentMethod === "WALLET" ? Math.min(walletBalance, cartTotals.total) : undefined

  const codCharges = paymentOptions.find((a) => a.type === "COD")?.charges ?? 0

  const codAmount = paymentMethod === "COD" ? codCharges : undefined

  const needToCombinePayment = (walletAmount ?? 0) < cartTotals.total

  const data = {
    ...initialData,
    cartTotals: {
      ...cartTotals,
      // wallet: walletAmount,
      // cod: codAmount,
      total: cartTotals.total + (codAmount ?? 0) - (walletAmount ?? 0),
    },
  } satisfies Awaited<ReturnType<typeof checkoutSessionQuery>>

  const paymentMethodProps = {
    value: paymentMethod,
    onValueChange: (method: PaymentMethod) => {
      paymentMethodSet(method)
    },
    defaultValue: "ONLINE",
  }

  const mutate = (method: PaymentMethod) => checkout.mutate(method)

  return { mutate, data, paymentMethodProps, needToCombinePayment, paymentMethod }
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)

  if (!context) throw new Error("Wrap useCheckout inside CheckoutProvider")

  return context
}

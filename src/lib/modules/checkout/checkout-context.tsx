"use client"

import { createContext, useContext, useState } from "react"
import { api } from "~/lib/trpc/trpc-client"
import { type PaymentMethod } from "../payment/payment-types"
import type { RouterOutput } from "~/lib/trpc/trpc-context"
import { useRouter } from "next/navigation"

const CheckoutContext = createContext<ReturnType<
  typeof useCheckoutContextLogic
> | null>(null)

interface CheckoutContextClientProps extends React.HTMLAttributes<HTMLElement> {
  data: RouterOutput["checkout"]["get"]
}

export function CheckoutContextClient({
  ...props
}: CheckoutContextClientProps) {
  const { data } = props

  const values = useCheckoutContextLogic(data)

  return (
    <CheckoutContext.Provider value={values}>
      {props.children}
    </CheckoutContext.Provider>
  )
}

function useCheckoutContextLogic(initialData: RouterOutput["checkout"]["get"]) {
  const [paymentMethod, paymentMethodSet] = useState<PaymentMethod>("ONLINE")
  const router = useRouter()

  // const navigate = useNavigate()

  // const apiContext = api.useContext()

  const { data: checkoutData } = api.checkout.get.useQuery(undefined, {
    initialData: initialData,
  })

  const handleApi = api.checkout.handle.useMutation({
    onSuccess: (response) => {
      window.location.href = response.data.url
    },

    onError: () => router.refresh(),
  })

  const placeOrderHandler = () => handleApi.mutate({ paymentMethod })

  const { cartTotals, walletBalance, paymentOptions } = checkoutData

  const paymentMethodProps = {
    value: paymentMethod,
    onValueChange: (method: PaymentMethod) => {
      paymentMethodSet(method)
    },
    defaultValue: "ONLINE",
  }

  const walletAmount =
    paymentMethod === "WALLET"
      ? Math.min(walletBalance, cartTotals.total)
      : undefined

  const codCharges = paymentOptions.find((a) => a.type === "COD")?.charges ?? 0

  const codAmount = paymentMethod === "COD" ? codCharges : undefined

  const needToCombinePayment = (walletAmount ?? 0) < cartTotals.total

  const data = {
    ...checkoutData,
    cartTotals: {
      ...cartTotals,
      wallet: walletAmount,
      cod: codAmount,
      total: cartTotals.total + (codAmount ?? 0) - (walletAmount ?? 0),
    },
  } satisfies RouterOutput["checkout"]["get"]

  return {
    data,
    paymentMethodProps,
    paymentMethod,
    needToCombinePayment,
    placeOrderHandler,
  }
}

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext)

  if (!context) throw new Error()

  return context
}

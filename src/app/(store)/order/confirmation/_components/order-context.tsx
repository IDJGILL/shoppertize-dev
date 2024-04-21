"use client"

import { redirect } from "next/navigation"
import { createContext, useContext } from "react"
import LoaderFallBack from "~/app/_components/loader-fallback"
import type { ConfirmationResponse } from "~/lib/modules/order/utils/order-types"
import { api } from "~/lib/server/access/client"

type OrderContextProps = {
  data: ConfirmationResponse | undefined
  isLoading: boolean
  content: {
    title: string
    message: string
  }
}

const OrderContext = createContext<OrderContextProps | null>(null)

interface OrderContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  token: string
}

export default function OrderContextProvider({
  ...props
}: OrderContextProviderProps) {
  const { token } = props

  const { data, isLoading } =
    api.store.order.verifyOrderConfirmation.useQuery(token)

  const createOrderMessage = () => {
    switch (data?.status) {
      case "PAYMENT_SUCCESS":
        return {
          title: "Order Placed Successfully",
          message:
            "We have received your order, Thanks for making us your choice.",
        }

      case "PAYMENT_ERROR":
        return {
          title: "Payment Failed",
          message:
            "Due to some unforeseen reasons, We could not verify your transaction. Please wait for few hours if the amount is deducted from your bank.",
        }

      case "PAYMENT_PENDING":
        return {
          title: "Payment Pending",
          message:
            "Payment is pending. Please wait until it fails or success. You can also try again from your order details page.",
        }

      case "PAYMENT_DECLINED":
        return {
          title: "Payment Declined",
          message:
            "Payment is declined. You can try again from your order details page.",
        }

      default:
        return {
          title: "Something went wrong",
          message:
            "If the amount is deducted from your account, Please wait for 24 hours it will be refunded automatically.",
        }
    }
  }

  const content = createOrderMessage()

  if (isLoading) return <LoaderFallBack />

  if (!data) return redirect("/")

  return (
    <OrderContext.Provider value={{ data, isLoading, content }}>
      {props.children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)

  if (!context) throw new Error("The child is not inside provider")

  return context
}

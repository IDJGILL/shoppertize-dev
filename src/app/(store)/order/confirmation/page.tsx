import React from "react"
import ShoppingFeedback from "./_components/shopping-feedback"
import OrderContextProvider from "./_components/order-context"
import { redirect } from "next/navigation"
import OrderStatusSection from "./_components/order-status-section"
import { ProductCarousel } from "~/lib/modules/carousel/components"

export default function SuccessPage(props: ServerComponentParams) {
  const token = props.searchParams?.token

  if (!token || typeof token !== "string") return redirect("/")

  return (
    <div className="container flex flex-col items-center">
      <OrderContextProvider token={token}>
        <OrderStatusSection />
        <ShoppingFeedback />
      </OrderContextProvider>

      <ProductCarousel
        options={{
          title: "You may also like",
          category: "all-products",
          type: "dynamic",
        }}
        className="container mb-12"
      />
    </div>
  )
}

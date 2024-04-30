import React from "react"
import CheckoutWrapper from "../checkout/_components/checkout-wrapper"
import { CartItems } from "./_components/cart-items"
import CartSummary from "./_components/cart-summary"
import PaymentButton from "./_components/payment-button"
import { CartContext } from "~/vertex/components/cart/cart-provider"
import EmptyCartWrapper from "./_components/cart-empty-screen"
import { AddressBar } from "~/vertex/components/address/address-bar"
import Box from "~/app/_components/box"
import AppLoader from "~/vertex/components/app/app-loader"
import AddressModel from "./_components/cart-address-model"

export default function CartPage() {
  return (
    <CartContext loader={<div>Loading...</div>} error={<div>Something went wrong</div>}>
      <EmptyCartWrapper>
        <CheckoutWrapper
          left={
            <>
              <Box>
                <AddressBar loader={<AppLoader className="h-10" />} error={<div>Something went wrong</div>}>
                  {(props) => (
                    <div className="flex justify-between text-sm">
                      {props.hasSelectedAddress ? (
                        <div>
                          {props.address ? (
                            <div className="">
                              <div className="font-semibold">Deliver to: {props.address.fullName}</div>
                              <div>
                                {props.address.address}, {props.address.postcode}
                              </div>

                              <div className="mt-4 text-green-600">
                                Expected Delivery {props.serviceability?.distanceString}
                              </div>
                            </div>
                          ) : (
                            "Check delivery time & services"
                          )}
                        </div>
                      ) : (
                        <div>
                          {props.serviceability ? (
                            <div>
                              <div>Deliver to: {props.serviceability.postcode}</div>
                              <div className="text-green-600">
                                Expected Delivery {props.serviceability.distanceString}
                              </div>
                            </div>
                          ) : (
                            "Check delivery time & services"
                          )}
                        </div>
                      )}

                      <AddressModel />
                    </div>
                  )}
                </AddressBar>
              </Box>

              <CartItems />
            </>
          }
          right={
            <div className="space-y-4">
              <CartSummary />
              <PaymentButton />
            </div>
          }
        />
      </EmptyCartWrapper>
    </CartContext>
  )
}

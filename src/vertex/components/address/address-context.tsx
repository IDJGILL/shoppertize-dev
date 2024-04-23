"use client"

import { createContext, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { $Address, type Address } from "~/vertex/modules/address/address-models"
import { useRouter } from "next/navigation"
import { addressHandlerAction, checkPostcodeAction, resendAddressOtpAction } from "~/vertex/lib/action/actions"
import type { getAddressById } from "~/vertex/modules/cart/cart-controllers"

const AddressContext = createContext<ReturnType<typeof useAddressContextLogic> | null>(null)

interface AddressContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  data: Awaited<ReturnType<typeof getAddressById>>
}

export function AddressContextProvider({ ...props }: AddressContextProviderProps) {
  const { data } = props

  return <AddressContext.Provider value={useAddressContextLogic(data)}>{props.children}</AddressContext.Provider>
}

function useAddressContextLogic(initial: Awaited<ReturnType<typeof getAddressById>>) {
  const [model, modelSet] = useState(false)

  const router = useRouter()

  const addressForm = useForm<Address>({
    resolver: zodResolver($Address),
    defaultValues: {
      shipping_firstName: initial?.address?.shipping.firstName ?? "",
      shipping_lastName: initial?.address?.shipping.lastName ?? "",
      shipping_phone: initial?.address?.shipping.phone ?? "",
      shipping_address1: initial?.address?.shipping.address1 ?? "",
      shipping_address2: initial?.address?.shipping.address2 ?? "",
      shipping_postcode: initial?.address?.shipping.postcode ?? "",
      shipping_city: initial?.address?.shipping?.city ?? "",
      shipping_state: initial?.address?.shipping.state ?? "",

      billing_firstName: initial?.address?.billing?.firstName ?? "",
      billing_phone: initial?.address?.billing?.phone ?? "",
      billing_address1: initial?.address?.billing?.address1 ?? "",
      billing_address2: initial?.address?.billing?.address2 ?? "",
      billing_postcode: initial?.address?.billing?.postcode ?? "",
      billing_city: initial?.address?.billing?.city ?? "",
      billing_state: initial?.address?.billing?.state ?? "",
      billing_tax: initial?.address?.billing?.company ?? "",

      isTaxInvoice: initial?.address.billing ? true : false,
    },
  })

  const addressHandler = useActionHandler(addressHandlerAction, {
    onSuccess: (response) => {
      if (!response.token) {
        modelSet(false)

        router.push("/cart")

        return
      }

      addressForm.setValue("token", response.token)

      modelSet(true)
    },

    onError: (error) => {
      console.log({ error })

      switch (error.code) {
        case "BAD_REQUEST": {
          addressForm.setValue("otp", undefined)
          addressForm.setError("otp", { message: error.message })
        }
      }
    },
  })

  const addressFormHandler = addressForm.handleSubmit((input) => addressHandler.mutate(input))

  const resendOtp = useActionHandler(resendAddressOtpAction, {
    onSuccess: (token) => {
      addressForm.clearErrors("otp")
      addressForm.setValue("otp", undefined)
      addressForm.setValue("token", token)
    },

    onError: (error) => {
      addressForm.setValue("otp", undefined)
      addressForm.setError("otp", { message: error.message })
    },
  })

  const resendOtpHandler = () => {
    resendOtp.mutate(addressForm.getValues("token") ?? "")
  }

  const checkShippingPostcode = useActionHandler(checkPostcodeAction, {
    onSuccess: (response) => {
      const shippingPostcode = addressForm.getValues("shipping_postcode")

      addressForm.setValue("shipping_postcode", shippingPostcode)
      addressForm.setValue("shipping_city", response.city)
      addressForm.setValue("shipping_state", response.state)
      addressForm.clearErrors("shipping_postcode")
    },

    onError: (error) => {
      addressForm.setError("shipping_postcode", {
        message: error.message,
      })

      addressForm.setValue("shipping_postcode", "")
      addressForm.setValue("shipping_city", "")
      addressForm.setValue("shipping_state", "")
    },
  })

  const checkBillingPostcode = useActionHandler(checkPostcodeAction, {
    onSuccess: (response) => {
      const billingPostcode = addressForm.getValues("billing_postcode")

      addressForm.setValue("billing_postcode", billingPostcode)
      addressForm.setValue("billing_city", response.city)
      addressForm.setValue("billing_state", response.state)
      addressForm.clearErrors("billing_postcode")
    },

    onError: (error) => {
      addressForm.setError("billing_postcode", {
        message: error.message,
      })

      addressForm.setValue("billing_postcode", "")
      addressForm.setValue("billing_city", "")
      addressForm.setValue("billing_state", "")
    },
  })

  const checkPincodeHandler = (type: "shipping" | "billing") => {
    switch (type) {
      case "shipping": {
        const shippingPostcode = addressForm.getValues("shipping_postcode")

        if (shippingPostcode.length !== 6) return

        checkShippingPostcode.mutate(shippingPostcode)

        break
      }

      case "billing": {
        const billingPostcode = addressForm.getValues("billing_postcode")

        if (billingPostcode.length !== 6) return

        checkBillingPostcode.mutate(billingPostcode)

        break
      }
    }
  }

  const sameAddressHandler = () => {
    const shipping_address1 = addressForm.getValues("shipping_address1")
    const shipping_address2 = addressForm.getValues("shipping_address2")
    const shipping_phone = addressForm.getValues("shipping_phone")
    const shipping_postcode = addressForm.getValues("shipping_postcode")
    const shipping_city = addressForm.getValues("shipping_city")
    const shipping_state = addressForm.getValues("shipping_state")

    addressForm.setValue("billing_address1", shipping_address1)
    addressForm.setValue("billing_address2", shipping_address2)
    addressForm.setValue("billing_phone", shipping_phone)
    addressForm.setValue("billing_postcode", shipping_postcode)
    addressForm.setValue("billing_city", shipping_city)
    addressForm.setValue("billing_state", shipping_state)
  }

  const isAddressLoading = false

  const isAddressUpdating = addressHandler.status === "executing"

  const isOtpResending = resendOtp.status === "executing"

  const modelProps = {
    open: model,
    onOpenChange: (a: boolean) => {
      modelSet(a)
      addressForm.clearErrors("otp")
      addressForm.setValue("otp", undefined)
      addressForm.setValue("token", undefined)
    },
  }

  console.log(addressForm.formState.errors)

  return {
    modelProps,
    addressForm,
    resendOtpHandler,
    sameAddressHandler,
    addressFormHandler,
    checkPincodeHandler,
    isAddressLoading,
    isAddressUpdating,
    isOtpResending,
  }
}

export const useAddress = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error()

  return context
}

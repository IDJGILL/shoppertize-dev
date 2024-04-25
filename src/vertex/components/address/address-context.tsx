"use client"

import { createContext, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import {
  $Address,
  $AddressVerification,
  type AddressVerification,
  type Address,
} from "~/vertex/modules/address/address-models"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCountDownAtom } from "~/vertex/hooks/useCountdown"
import { addressCountdownAtom } from "./address-otp"
import { type getAddressById } from "~/vertex/modules/address/address-queries"
import { addressAction, addressPostcodeAction } from "~/vertex/lib/server/server-actions"

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
  const countdown = useCountDownAtom(addressCountdownAtom)

  const router = useRouter()

  const addressForm = useForm<Address>({
    resolver: zodResolver($Address),
    defaultValues: {
      addressId: initial?.id ?? "",
      shipping_firstName: initial?.address?.shipping.first_name ?? "",
      shipping_lastName: initial?.address?.shipping.last_name ?? "",
      shipping_address1: initial?.address?.shipping.address_1 ?? "",
      shipping_address2: initial?.address?.shipping.address_2 ?? "",
      shipping_city: initial?.address?.shipping?.city ?? "",
      shipping_state: initial?.address?.shipping.state ?? "",
      shipping_postcode: initial?.address?.shipping.postcode ?? "",
      shipping_country: initial?.address?.shipping.country ?? "",
      shipping_phone: initial?.address?.shipping.phone ?? "",

      billing_firstName: initial?.address?.billing?.first_name ?? "",
      billing_tax: initial?.address?.billing?.company ?? "",
      billing_address1: initial?.address?.billing?.address_1 ?? "",
      billing_address2: initial?.address?.billing?.address_2 ?? "",
      billing_city: initial?.address?.billing?.city ?? "",
      billing_state: initial?.address?.billing?.state ?? "",
      billing_postcode: initial?.address?.billing?.postcode ?? "",
      billing_phone: initial?.address?.billing?.phone ?? "",
      billing_country: initial?.address?.billing?.country ?? "",

      isTaxInvoice: initial?.address.billing ? true : false,
    },
  })

  const addressHandler = useActionHandler(addressAction, {
    onSuccess: (response) => {
      if (response.data) {
        otpForm.setValue("id", response.data ?? "")

        countdown(60)

        return modelSet(true)
      }

      router.push("/cart")
    },

    onError: (error) => {
      toast.success(error.message)
    },
  })

  const addressFormHandler = addressForm.handleSubmit((input) => addressHandler.mutate(input))

  const otpForm = useForm<AddressVerification>({
    resolver: zodResolver($AddressVerification),
  })

  const checkShippingPostcode = useActionHandler(addressPostcodeAction, {
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

  const checkBillingPostcode = useActionHandler(addressPostcodeAction, {
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

  const isAddressUpdating = addressHandler.isLoading

  const modelProps = {
    open: model,
    onOpenChange: (a: boolean) => {
      modelSet(a)
      otpForm.clearErrors("otp")
      otpForm.setValue("otp", "")
      otpForm.setValue("id", "")
    },
  }

  console.log(addressForm.formState.errors)

  console.log(otpForm.formState.errors)

  return {
    modelProps,
    addressForm,
    sameAddressHandler,
    addressFormHandler,
    checkPincodeHandler,
    isAddressLoading,
    isAddressUpdating,
    otpForm,
    router,
    countdown,
  }
}

export const useAddress = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error()

  return context
}

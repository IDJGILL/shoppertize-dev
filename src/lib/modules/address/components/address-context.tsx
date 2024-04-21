"use client"

import { createContext, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { api } from "~/lib/trpc/trpc-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "../../app/components/navigate"
import { useActionHandler } from "~/vertex/lib/action/hook"
import {
  addAddress,
  updateAddress,
} from "~/vertex/modules/address/address-actions"
import { $Address, type Address } from "~/vertex/modules/address/address-schema"

const AddressContext = createContext<ReturnType<
  typeof useAddressContextLogic
> | null>(null)

interface AddressContextProviderProps
  extends React.HTMLAttributes<HTMLElement> {}

export function AddressContextProvider({
  ...props
}: AddressContextProviderProps) {
  const {} = props

  return (
    <AddressContext.Provider value={useAddressContextLogic()}>
      {props.children}
    </AddressContext.Provider>
  )
}

function useAddressContextLogic() {
  // const getBothAddressApi = api.address.getBothAddress.useQuery()

  // const { data } = getBothAddressApi

  const navigate = useNavigate()

  // const fillCurrentAddressHandler = useCallback(() => {
  //   addressForm.reset({
  //     shipping_firstName: data?.shipping.firstName ?? "",
  //     shipping_lastName: data?.shipping.lastName ?? "",
  //     shipping_phone: data?.shipping.phone ?? "",
  //     shipping_address1: data?.shipping.address1 ?? "",
  //     shipping_address2: data?.shipping.address2 ?? "",
  //     shipping_postcode: data?.shipping.postcode ?? "",
  //     shipping_city: data?.shipping?.city ?? "",
  //     shipping_state: data?.shipping.state ?? "",

  //     billing_firstName: data?.billing?.firstName ?? "",
  //     billing_phone: data?.billing?.phone ?? "",
  //     billing_address1: data?.billing?.address1 ?? "",
  //     billing_address2: data?.billing?.address2 ?? "",
  //     billing_postcode: data?.billing?.postcode ?? "",
  //     billing_city: data?.billing?.city ?? "",
  //     billing_state: data?.billing?.state ?? "",
  //     billing_tax: data?.billing?.company ?? "",

  //     isTaxInvoice: !!data?.billing?.address1,
  //   })
  //
  // }, [data])

  // useEffect(() => fillCurrentAddressHandler(), [data])

  const [model, modelSet] = useState(false)

  const addressForm = useForm<Address>({
    resolver: zodResolver($Address),
  })

  console.log(addressForm.formState.errors)

  const addressFormHandler = addressForm.handleSubmit((input) =>
    addAddressAction.mutate(input),
  )

  const addAddressAction = useActionHandler(addAddress, {
    onSuccess: (response) => {
      if (!response.data?.token) {
        modelSet(false)

        navigate.push("cart")

        return
      }

      addressForm.setValue("shipping_token", response.data.token)

      modelSet(true)
    },

    onError: (error) => {
      switch (error.code) {
        case "BAD_REQUEST": {
          addressForm.setValue("shipping_otp", undefined)
          addressForm.setError("shipping_otp", { message: error.message })
        }
      }
    },
  })

  const updateAddressAction = useActionHandler(updateAddress, {
    onSuccess: (response) => {
      if (!response.data?.token) {
        modelSet(false)

        navigate.push("cart")

        return
      }

      addressForm.setValue("shipping_token", response.data.token)

      modelSet(true)
    },

    onError: (error) => {
      switch (error.code) {
        case "BAD_REQUEST": {
          addressForm.setValue("shipping_otp", undefined)
          addressForm.setError("shipping_otp", { message: error.message })
        }
      }
    },
  })

  const resendOtpApi = api.address.resendOtp.useMutation({
    onSuccess: (response) => {
      addressForm.clearErrors("shipping_otp")
      addressForm.setValue("shipping_otp", undefined)
      addressForm.setValue("shipping_token", response.data.token)
    },
    onError: (error) => {
      addressForm.setValue("shipping_otp", undefined)
      addressForm.setError("shipping_otp", { message: error.message })
    },
  })

  const resendOtpHandler = (onSuccess?: () => void) => {
    resendOtpApi.mutate(addressForm.getValues("shipping_token") ?? "", {
      onSuccess,
      onError: (error) => {
        addressForm.setError("shipping_otp", { message: error.message })
      },
    })
  }

  const checkPincodeApi = api.courier.checkService.useMutation()

  const checkPincodeHandler = (type: "shipping" | "billing") => {
    switch (type) {
      case "shipping": {
        const shippingPostcode = addressForm.getValues("shipping_postcode")

        if (shippingPostcode.length !== 6) return

        checkPincodeApi.mutate(
          { pincode: shippingPostcode },
          {
            onSuccess: (response) => {
              addressForm.setValue("shipping_postcode", shippingPostcode)
              addressForm.setValue("shipping_city", response.data.city)
              addressForm.setValue("shipping_state", response.data.state)
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
          },
        )

        break
      }

      case "billing": {
        const billingPostcode = addressForm.getValues("billing_postcode")

        if (billingPostcode.length !== 6) return

        checkPincodeApi.mutate(
          { pincode: billingPostcode },
          {
            onSuccess: (response) => {
              addressForm.setValue("billing_postcode", billingPostcode)
              addressForm.setValue("billing_city", response.data.city)
              addressForm.setValue("billing_state", response.data.state)
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
          },
        )

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

  const isAddressUpdating = addAddressAction.status === "executing"

  const isOtpResending = resendOtpApi.status === "pending"

  const modelProps = {
    open: model,
    onOpenChange: (a: boolean) => {
      modelSet(a)
      addressForm.clearErrors("shipping_otp")
      addressForm.setValue("shipping_otp", undefined)
      addressForm.setValue("shipping_token", undefined)
    },
  }

  return {
    modelProps,
    addressForm,
    checkPincodeApi,
    resendOtpHandler,
    sameAddressHandler,
    addressFormHandler,
    checkPincodeHandler,
    isAddressLoading,
    isAddressUpdating,
    isOtpResending,
  }
}

export const useAddressContext = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error()

  return context
}

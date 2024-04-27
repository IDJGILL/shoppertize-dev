"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import {
  $Shipping,
  type Shipping,
  $AddressVerification,
  type AddressVerification,
} from "~/vertex/modules/address/address-models"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCountDownAtom } from "~/vertex/hooks/useCountdown"
import { addressCountdownAtom } from "./address-verification"
import { addressAction } from "~/vertex/lib/server/server-actions"
import { countries } from "~/vertex/global/global-constants"
import { type queryAddressById } from "~/vertex/lib/server/server-queries"

const AddressContext = createContext<ReturnType<typeof useAddressContextLogic> | null>(null)

interface AddressContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  data: Awaited<ReturnType<typeof queryAddressById>>
}

export function AddressContextProvider({ ...props }: AddressContextProviderProps) {
  const { data } = props

  return <AddressContext.Provider value={useAddressContextLogic(data)}>{props.children}</AddressContext.Provider>
}

function useAddressContextLogic(initial: Awaited<ReturnType<typeof queryAddressById>>) {
  const [model, modelSet] = useState(false)
  const countdown = useCountDownAtom(addressCountdownAtom)

  const router = useRouter()

  const addressForm = useForm<Shipping>({
    resolver: zodResolver($Shipping),
    defaultValues: { saveAs: "other", ...initial?.address },
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

  // const checkPostcode = useActionHandler(addressPostcodeAction, {
  //   onSuccess: (response) => {
  //     const shippingPostcode = addressForm.getValues("postcode")

  //     const state = statesByCountryCode?.find((a) => a.name.toLowerCase() === response.state.toLowerCase())?.code ?? ""

  //     addressForm.reset({ state: state, city: response.city, postcode: shippingPostcode })
  //     addressForm.clearErrors("postcode")
  //   },

  //   onError: (error) => {
  //     addressForm.setError("postcode", {
  //       message: error.message,
  //     })

  //     addressForm.setValue("postcode", "")
  //     addressForm.setValue("city", "")
  //     addressForm.setValue("state", "")
  //   },
  // })

  const checkPostcodeHandler = () => {
    const shippingPostcode = addressForm.getValues("postcode")

    if (shippingPostcode.length !== 6) return

    // checkPostcode.mutate(shippingPostcode)
  }

  const isAddressLoading = false

  const isAddressUpdating = addressHandler.isLoading

  const currentCountry = addressForm.watch("country")

  const statesByCountryCode = useMemo(() => {
    const data = countries.find((a) => a.code === currentCountry)

    if (data?.states.length === 0) return null

    return data?.states ?? null
  }, [currentCountry])

  const country = useMemo(() => {
    return countries
      .filter((a) => initial?.allowedCountries.includes(a.code))
      .map((a) => ({ code: a.code, name: a.name }))
  }, [initial?.allowedCountries])

  const modelProps = {
    open: model,
    onOpenChange: (a: boolean) => {
      modelSet(a)
      otpForm.clearErrors("otp")
      otpForm.setValue("otp", "")
      otpForm.setValue("id", "")
    },
  }

  return {
    modelProps,
    addressForm,
    addressFormHandler,
    isAddressLoading,
    isAddressUpdating,
    otpForm,
    router,
    countdown,
    statesByCountryCode,
    country,
    checkPostcodeHandler,
  }
}

export const useAddress = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error()

  return context
}

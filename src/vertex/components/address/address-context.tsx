"use client"

import { createContext, useContext, useMemo, useState } from "react"
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
import { addressAction, addressPostcodeAction } from "~/vertex/lib/server/server-actions"
import { type queryAddressById } from "~/vertex/lib/server/server-queries"
import { countries } from "~/vertex/global/data/data-countries"
import { useUpdateEffect } from "react-use"

const AddressContext = createContext<ReturnType<typeof useAddressContextLogic> | null>(null)

interface AddressContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  data: Awaited<ReturnType<typeof queryAddressById>>
}

export function AddressContextProvider({ ...props }: AddressContextProviderProps) {
  const { data } = props

  return <AddressContext.Provider value={useAddressContextLogic(data)}>{props.children}</AddressContext.Provider>
}

function useAddressContextLogic(initial: Awaited<ReturnType<typeof queryAddressById>>) {
  const [modelState, modelStateSet] = useState(false)
  const countdown = useCountDownAtom(addressCountdownAtom)

  const router = useRouter()

  const form = useForm<Shipping>({
    resolver: zodResolver($Shipping),
    defaultValues: { saveAs: "other", ...initial?.address },
  })

  const addressHandler = useActionHandler(addressAction, {
    onSuccess: (response) => {
      if (response.data) {
        otpForm.setValue("id", response.data ?? "")

        countdown(60)

        return modelStateSet(true)
      }

      router.push("/cart")
    },

    onError: (error) => {
      toast.success(error.message)
    },
  })

  const formHandler = form.handleSubmit((input) => {
    addressHandler.mutate(input)
  })

  const otpForm = useForm<AddressVerification>({
    resolver: zodResolver($AddressVerification),
  })

  const checkPostcodeAction = useActionHandler(addressPostcodeAction, {
    onSuccess: (response) => {
      console.log(response)
      form.setValue("postcode", response.postcode)
      form.setValue("city", response.city)
      form.setValue("state", response.state)
      form.clearErrors(["postcode", "city", "state"])
    },

    onError: (error) => {
      form.reset({ postcode: "", city: "", state: "" })

      form.setError("postcode", { message: error.message })
    },
  })

  const checkPostcode = () => {
    const postcode = form.getValues("postcode") ?? ""

    if (postcode.length < 6 || countryValue !== "IN") return

    checkPostcodeAction.mutate(postcode)
  }

  const currentCountry = form.watch("country")

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

  const modelController = {
    open: modelState,
    onOpenChange: (a: boolean) => {
      modelStateSet(a)
      otpForm.clearErrors("otp")
      otpForm.setValue("otp", "")
      otpForm.setValue("id", "")
    },
  }

  const countryValue = form.watch("country")

  const stateController = {
    autoComplete: countryValue === "IN" ? "none" : "on",
    disabled: countryValue === "IN",
  } satisfies React.InputHTMLAttributes<HTMLInputElement>

  const cityController = {
    autoComplete: countryValue === "IN" ? "none" : "on",
    disabled: countryValue === "IN",
  } satisfies React.InputHTMLAttributes<HTMLInputElement>

  const postcodeController = {
    onKeyUp: (e) => {
      const value = e.currentTarget.value

      if (value.length < 6 || countryValue !== "IN") return

      checkPostcode()
    },
    maxLength: countryValue === "IN" ? 6 : 10,
    type: "text",
    inputMode: "numeric",
  } satisfies React.InputHTMLAttributes<HTMLInputElement>

  useUpdateEffect(() => checkPostcode(), [countryValue])

  const isAddressUpdating = addressHandler.isLoading

  return {
    form,
    formHandler,
    isAddressUpdating,
    otpForm,
    router,
    countdown,
    statesByCountryCode,
    country,
    checkPostcode,
    stateController,
    cityController,
    modelController,
    postcodeController,
  }
}

export const useAddress = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error()

  return context
}

"use client"

import {
  $Shipping,
  type Shipping,
  $AddressVerification,
  type AddressVerification,
} from "~/vertex/modules/address/address-models"
import { createContext, useContext, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  addressAction,
  addressPostcodeAction,
  addressResendAction,
  addressVerifyAction,
} from "~/vertex/lib/server/server-actions"
import { countries } from "~/vertex/global/data/data-countries"
import { useUpdateEffect } from "react-use"
import { useCountdown } from "~/vertex/hooks/useCountdown"

const AddressContext = createContext<ReturnType<typeof useAddressFormLogic> | null>(null)

interface AddressFormContextProps {
  initial: { address: Partial<Shipping>; allowedCountries: string[] }
  children: React.ReactNode
}

export function AddressFormContext({ ...props }: AddressFormContextProps) {
  const {} = props

  const values = useAddressFormLogic({ initial: props.initial })

  return <AddressContext.Provider value={values}>{props.children}</AddressContext.Provider>
}

function useAddressFormLogic(props: Omit<AddressFormContextProps, "children">) {
  const [modelState, modelStateSet] = useState(false)
  const countdown = useCountdown({ seconds: 60, autoStart: false })

  const router = useRouter()

  const addressForm = useForm<Shipping>({
    resolver: zodResolver($Shipping),
    defaultValues: { saveAs: "other", ...props.initial?.address },
  })

  const addressHandlerAction = useActionHandler(addressAction, {
    onSuccess: (response) => {
      if (response.data) {
        otpForm.setValue("id", response.data ?? "")

        countdown.start()

        return modelStateSet(true)
      }

      router.push("/cart")
    },

    onError: (error) => {
      toast.success(error.message)
    },
  })

  const addressFormHandler = addressForm.handleSubmit((input) => {
    addressHandlerAction.mutate(input)
  })

  const verifyAddressAction = useActionHandler(addressVerifyAction, {
    onSuccess: () => {
      router.push("/cart")
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
    },
  })

  const otpForm = useForm<AddressVerification>({
    resolver: zodResolver($AddressVerification),
  })

  const otpFormHandler = otpForm.handleSubmit((input) => verifyAddressAction.mutate(input))

  const resendOtpAction = useActionHandler(addressResendAction, {
    onSuccess: () => {
      countdown.restart()
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
    },
  })

  const mutateResend = () => resendOtpAction.mutate(otpForm.getValues("id"))

  const checkPostcodeAction = useActionHandler(addressPostcodeAction, {
    onSuccess: (response) => {
      console.log(response)
      addressForm.setValue("postcode", response.postcode)
      addressForm.setValue("city", response.city)
      addressForm.setValue("state", response.state)
      addressForm.clearErrors(["postcode", "city", "state"])
    },

    onError: (error) => {
      addressForm.reset({ postcode: "", city: "", state: "" })

      addressForm.setError("postcode", { message: error.message })
    },
  })

  const checkPostcode = () => {
    const postcode = addressForm.getValues("postcode") ?? ""

    if (postcode.length < 6 || countryValue !== "IN") return

    checkPostcodeAction.mutate({ postcode })
  }

  const currentCountry = addressForm.watch("country")

  const statesByCountryCode = useMemo(() => {
    const data = countries.find((a) => a.code === currentCountry)

    if (data?.states.length === 0) return null

    return data?.states ?? null
  }, [currentCountry])

  const country = useMemo(() => {
    return countries
      .filter((a) => props.initial.allowedCountries.includes(a.code))
      .map((a) => ({ code: a.code, name: a.name }))
  }, [props.initial.allowedCountries])

  const modelController = {
    open: modelState,
    onOpenChange: (a: boolean) => {
      modelStateSet(a)
      otpForm.clearErrors("otp")
      otpForm.setValue("otp", "")
      otpForm.setValue("id", "")
    },
  }

  const countryValue = addressForm.watch("country")

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

  const isUpdating = addressHandlerAction.isLoading

  const isResending = resendOtpAction.isLoading

  const isVerifying = verifyAddressAction.isLoading

  const countdownRemaining = countdown.remaining

  const isCountdownComplete = countdown.isCompleted

  return {
    addressForm,
    addressFormHandler,
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
    isUpdating,
    isResending,
    isVerifying,
    otpFormHandler,
    mutateResend,
    countdownRemaining,
    isCountdownComplete,
  }
}

export const useAddressForm = () => {
  const context = useContext(AddressContext)

  if (!context) throw new Error("Wrap useAddressForm inside AddressFormBuilder")

  return context
}

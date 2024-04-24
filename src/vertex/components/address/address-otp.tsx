"use client"

import useCountDown from "~/vertex/hooks/useCountdown"
import { useUpdateEffect } from "react-use"
import { useActionHandler } from "~/vertex/lib/action/hook"
import { resendAddressOtpAction, verifyAddressAction } from "~/vertex/lib/action/actions"
import { useAddress } from "./address-context"
import useCountdown from "@bradgarropy/use-countdown"

export type AddressOtpProps = ReturnType<typeof useAddressOtp>

interface Props {
  children: (p: AddressOtpProps) => React.ReactNode
}

export function AddressOtp({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAddressOtp())}</>
}

export function useAddressOtp() {
  const { otpForm, modelProps, router } = useAddress()

  const countdown = useCountdown({
    minutes: 1,
    format: "ss",
    autoStart: false,
  })

  //   useUpdateEffect(() => countdown.start(), [modelProps.open])

  const verifyAddress = useActionHandler(verifyAddressAction, {
    onSuccess: () => {
      router.push("/cart")
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
      countdown.reset()
    },
  })

  const resendOtp = useActionHandler(resendAddressOtpAction, {
    onSuccess: () => {
      countdown.reset({ minutes: 1, seconds: 0 })
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
      countdown.reset()
    },
  })

  const mutateResend = () => {
    resendOtp.mutate(otpForm.getValues("id"))
  }

  const isResending = resendOtp.isLoading

  const isVerifying = verifyAddress.isLoading

  const form = otpForm

  const mutateVerify = otpForm.handleSubmit((input) => verifyAddress.mutate(input))

  return {
    form,
    mutateResend,
    mutateVerify,
    isResending,
    isVerifying,
    modelProps,
    ...countdown,
  }
}

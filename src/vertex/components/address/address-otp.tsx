"use client"

import { useCountDown } from "~/vertex/hooks/useCountdown"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { addressResendAction, addressVerifyAction } from "~/vertex/lib/server/server-actions"
import { useAddress } from "./address-context"
import { atom } from "jotai"

export const addressCountdownAtom = atom(0)

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
  const countdown = useCountDown(addressCountdownAtom)

  const verifyAddress = useActionHandler(addressVerifyAction, {
    onSuccess: () => {
      router.push("/cart")
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
    },
  })

  const resendOtp = useActionHandler(addressResendAction, {
    onSuccess: () => {
      countdown.reset(60)
    },

    onError: (error) => {
      otpForm.setError("otp", { message: error.message })
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
    countdown,
  }
}

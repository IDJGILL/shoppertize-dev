"use client"

import { useCountDown } from "~/vertex/hooks/useCountdown"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { addressResendAction, addressVerifyAction } from "~/vertex/lib/server/server-actions"
import { useAddress } from "./address-context"
import { atom } from "jotai"

export const addressCountdownAtom = atom(0)

export type AddressVerificationProps = ReturnType<typeof useAddressVerification>

interface Props {
  children: (p: AddressVerificationProps) => React.ReactNode
}

export function AddressVerification({ ...props }: Props) {
  const {} = props

  return <>{props.children(useAddressVerification())}</>
}

export function useAddressVerification() {
  const { otpForm, modelController, router } = useAddress()
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
    modelController,
    countdown,
  }
}

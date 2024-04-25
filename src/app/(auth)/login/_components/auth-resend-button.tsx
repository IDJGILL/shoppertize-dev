"use client"

import { Button } from "~/app/_components/ui/button"
import { AuthResend } from "~/vertex/components/auth"

interface AuthResendButtonProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthResendButton({ ...props }: AuthResendButtonProps) {
  const {} = props

  return (
    <AuthResend>
      {({ mutate, countdown, isLoading }) => (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={!countdown.isCompleted}
          onClick={() => mutate()}
          loading={isLoading ? "true" : "false"}
        >
          {!countdown.isCompleted ? `Resend in (00:${countdown.remaining})` : "Resend"}
        </Button>
      )}
    </AuthResend>
  )
}

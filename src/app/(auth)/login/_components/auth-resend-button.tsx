"use client"

import { Button } from "~/app/_components/ui/button"
import { AuthResend } from "~/vertex/components/auth"

interface AuthResendButtonProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthResendButton({ ...props }: AuthResendButtonProps) {
  const {} = props

  return (
    <AuthResend>
      {({ mutate, isCompleted, isLoading, remaining }) => (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={!isCompleted}
          onClick={() => mutate()}
          loading={isLoading ? "true" : "false"}
        >
          {!isCompleted ? `Resend in (00:${remaining})` : "Resend"}
        </Button>
      )}
    </AuthResend>
  )
}

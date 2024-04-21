import { AuthPolling } from "~/vertex/components/auth/auth-polling"
import AuthResendButton from "./auth-resend-button"
import AuthShell from "./auth-shell"

interface AuthPollingScreenProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthPollingScreen({
  ...props
}: AuthPollingScreenProps) {
  const {} = props

  return (
    <AuthShell>
      <AuthPolling>{() => <div>Checking...</div>}</AuthPolling>

      <AuthResendButton />
    </AuthShell>
  )
}

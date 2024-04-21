import { AuthVerify } from "~/vertex/components/auth/auth-verify"

interface AuthVerifyScreenProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthVerifyScreen({ ...props }: AuthVerifyScreenProps) {
  const {} = props

  return (
    <AuthVerify verify="auto">
      {({ message }) => <div>{message}</div>}
    </AuthVerify>
  )
}

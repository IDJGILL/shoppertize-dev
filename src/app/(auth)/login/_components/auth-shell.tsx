import AuthFooter from "./auth-footer"
import AuthHeader from "./auth-header"

interface AuthShellProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthShell({ ...props }: AuthShellProps) {
  const {} = props

  return (
    <>
      <AuthHeader />

      {props.children}

      <AuthFooter />
    </>
  )
}

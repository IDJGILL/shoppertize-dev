import { TRPCContextProvider } from "~/vertex/lib/trpc/trpc-context-provider"
import { AuthSessionProvider } from "../auth/auth-session-context"
import JotaiProvider from "./jotai-provider"

interface AppContextProps extends React.HTMLAttributes<HTMLElement> {}

export default function AppContext({ ...props }: AppContextProps) {
  const {} = props

  return (
    <JotaiProvider>
      <TRPCContextProvider>
        <AuthSessionProvider>{props.children}</AuthSessionProvider>
      </TRPCContextProvider>
    </JotaiProvider>
  )
}

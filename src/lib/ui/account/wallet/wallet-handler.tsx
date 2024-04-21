import WalletLayout from "~/app/(store)/account/wallet/_components/wallet-layout"
import { type RouterOutputs } from "~/lib/utils/functions/trpc"

interface WalletHandlerProps extends React.HTMLAttributes<HTMLElement> {
  wallet: RouterOutputs["store"]["wallet"]["getWallet"]
}

export default function WalletHandler({ ...props }: WalletHandlerProps) {
  const { wallet } = props

  return <WalletLayout wallet={wallet} />
}

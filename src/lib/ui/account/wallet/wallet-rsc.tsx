import { getWallet } from "~/lib/server/api/store/wallet/wallet.modules"
import WalletHandler from "./wallet-handler"
import { auth } from "~/lib/modules/auth/auth-config"

export default async function WalletRSC() {
  const session = await auth()

  if (!session) throw new Error()

  const data = await getWallet(session.user.email)

  return <WalletHandler wallet={data} />
}

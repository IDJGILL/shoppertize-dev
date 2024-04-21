import { type RouterOutputs } from "~/lib/utils/functions/trpc"
import AccountSectionWrapper from "../../_components/account-section-wrapper"
import { currency } from "~/constants"
import { formatDate } from "~/lib/utils/functions/format-date"
import { cn } from "~/lib/utils/functions/ui"
import Box from "~/app/_components/box"

interface WalletLayoutProps extends React.HTMLAttributes<HTMLElement> {
  wallet: RouterOutputs["store"]["wallet"]["getWallet"]
}

export default function WalletLayout({ ...props }: WalletLayoutProps) {
  const { wallet } = props

  return (
    <AccountSectionWrapper
      title="My Wallet"
      sub="View, track wallet transactions"
      className="max-w-2xl"
    >
      <Box className="p-0">
        <div className="flex items-baseline justify-between border-b p-5">
          <div className="text-base ">Current Balance:</div>

          <div className="">
            {currency}
            {wallet.walletBalance}
          </div>
        </div>

        <div className="flex flex-col py-4">
          {wallet.transactionHistory.length ? (
            wallet.transactionHistory.map((transaction) => (
              <div
                key={transaction.date}
                className="flex items-center justify-between px-5 py-2"
              >
                <div>
                  <div className="text-sm  uppercase">{transaction.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate({
                      date: transaction.date,
                    })}
                  </div>
                </div>

                <div>
                  <div
                    className={cn("text-right text-sm font-medium", {
                      "text-red-500": transaction.type === "debit",
                      "text-green-500": transaction.type === "credit",
                    })}
                  >
                    {transaction.type === "debit" ? "-" : "+"}
                    {currency}
                    {(+transaction.amount).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">No transaction found.</div>
          )}
        </div>
      </Box>
    </AccountSectionWrapper>
  )
}

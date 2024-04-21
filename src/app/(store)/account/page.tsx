import Link from "next/link"
import { accountNavigations } from "~/lib/utils/constants/navigations"
import AccountSectionWrapper from "./_components/account-section-wrapper"
import { type ReactNode } from "react"
import Box from "~/app/_components/box"
import OrderIcon from "~/assets/icons/account/orders.png"
import WalletIcon from "~/assets/icons/account/wallet.png"
import AddressIcon from "~/assets/icons/account/address.png"
import WishlistIcon from "~/assets/icons/account/wishlist.png"
import ProfileIcon from "~/assets/icons/account/profile.png"
import Image from "next/image"

export default function AccountPage() {
  return (
    <AccountSectionWrapper
      title="My account"
      sub="Manage orders, address and profile"
    >
      <div className="grid gap-4 md:grid-cols-3 md:gap-4 md:px-0 lg:grid-cols-4">
        <AccountOptionWrapper
          name="My Orders"
          icon={<Image src={OrderIcon} alt="Orders" />}
          dsc="Track, view and manage orders"
          link={accountNavigations.static.orders.path}
        />

        <AccountOptionWrapper
          name="My Address"
          icon={<Image src={AddressIcon} alt="Address" />}
          dsc="View and update your address"
          link={accountNavigations.static.address.path}
        />

        <AccountOptionWrapper
          name="My Wallet"
          icon={<Image src={WalletIcon} alt="Wallet" />}
          dsc="View wallet, history and balance"
          link={accountNavigations.static.wallet.path}
        />

        <AccountOptionWrapper
          name="My Wishlist"
          icon={<Image src={WishlistIcon} alt="Wishlist" />}
          dsc="Manage and shop from wishlist"
          link={accountNavigations.static.wishlist.path}
        />

        <AccountOptionWrapper
          name="My Profile"
          icon={<Image src={ProfileIcon} alt="profile" />}
          dsc="Manage and update your profile"
          link={accountNavigations.static.profile.path}
        />
      </div>
    </AccountSectionWrapper>
  )
}

interface AccountOptionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  dsc: string
  link: string
  icon: ReactNode
}

function AccountOptionWrapper({ ...props }: AccountOptionWrapperProps) {
  return (
    <Link href={props.link}>
      <Box
        className="group relative mb-2 flex min-h-[100px] items-center p-4 md:items-start"
        {...props}
      >
        <div className="flex items-center gap-4 ">
          <div className="w-[12%] md:w-[30%]">{props.icon}</div>

          <div>
            <h3 className="text-base  group-hover:text-primary">
              {props.name}
            </h3>

            <p className="text-sm text-muted-foreground">{props.dsc}</p>
          </div>
        </div>
      </Box>
    </Link>
  )
}

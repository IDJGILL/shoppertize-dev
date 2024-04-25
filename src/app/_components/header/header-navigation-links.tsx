import Link from "next/link"
import { accountNavigations, authNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"
import { AuthLogout } from "~/vertex/components/auth/auth-logout"
import { type AuthClientSession } from "~/vertex/global/types"

interface MenuHeaderProps extends React.HTMLAttributes<HTMLElement> {
  session: AuthClientSession
}

export function MenuHeader({ ...props }: MenuHeaderProps) {
  const { session } = props

  const name = session.user?.name.split(" ")[0]

  return (
    <Link href={!session.isLoggedIn ? accountNavigations.static.account.path : authNavigations.static.login.path}>
      <div className={cn("flex-1 border-b bg-gray-100 px-4 py-3")}>
        <div className="text-sm font-medium italic text-muted-foreground">
          {name ? `Hi, ${name}` : "Login / Sign Up"}
        </div>
      </div>
    </Link>
  )
}

interface AccountMenuLinksProps extends React.HTMLAttributes<HTMLElement> {
  session: AuthClientSession
}

export function AccountMenuLinks({ ...props }: AccountMenuLinksProps) {
  return (
    <ul className={cn("text-sm")}>
      <li className="">
        <Link
          href={accountNavigations.static.account.path}
          className={cn("inline-block w-full select-none px-4 py-3 hover:bg-zinc-100 md:px-8", props.className)}
        >
          {accountNavigations.static.account.label("My Account")}
        </Link>
      </li>

      <li className="">
        <Link
          href={accountNavigations.static.orders.path}
          className={cn("inline-block w-full select-none px-4 py-3 hover:bg-zinc-100 md:px-8", props.className)}
        >
          {accountNavigations.static.orders.label("My Orders")}
        </Link>
      </li>

      <li className="">
        <Link
          href={accountNavigations.static.address.path}
          className={cn("inline-block w-full select-none px-4 py-3 hover:bg-zinc-100 md:px-8", props.className)}
        >
          {accountNavigations.static.address.label("My Address")}
        </Link>
      </li>

      <li className="w-full ">
        <Link
          href={accountNavigations.static.wishlist.path}
          className={cn("inline-block w-full select-none px-4 py-3 hover:bg-zinc-100 md:px-8", props.className)}
        >
          {accountNavigations.static.wishlist.label("My Wishlist")}
        </Link>
      </li>

      <AuthLogout>
        {({ mutate }) =>
          props.session.isLoggedIn && (
            <li
              className={cn(
                "inline-block w-full cursor-pointer select-none px-4 py-3 hover:bg-zinc-100 md:px-8",
                props.className,
              )}
              onClick={() => mutate()}
            >
              Logout
            </li>
          )
        }
      </AuthLogout>
    </ul>
  )
}

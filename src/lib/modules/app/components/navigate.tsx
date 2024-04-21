import Link from "next/link"
import { pageRoutes, type PageRoute } from "../utils/page-routes"
import { redirect as move, useRouter } from "next/navigation"

interface NavigateProps extends React.HTMLAttributes<HTMLElement> {
  to: PageRoute
}

export default function Navigate({ ...props }: NavigateProps) {
  const { to } = props

  return <Link href={pageRoutes[to]}>{props.children}</Link>
}

export const useNavigate = () => {
  const router = useRouter()

  return {
    push: (to: PageRoute) => router.push(pageRoutes[to]),
    replace: (to: PageRoute) => router.replace(pageRoutes[to]),
    back: () => router.back(),
  }
}

export const redirect = (to: PageRoute) => move(pageRoutes[to])

import { config as routeConfig } from "./vertex/global/config"
import { auth } from "./vertex/lib/auth/auth-config"

export default auth((req) => {
  const { auth, nextUrl, url } = req

  const isLoggedIn = !!auth

  const callbackUrl = nextUrl.searchParams.get("callbackUrl")

  const isProtected = routeConfig.protectedRoutes.some((a) => nextUrl.pathname.startsWith(a))

  const isAuthRoute = routeConfig.authRoutes.includes(nextUrl.pathname)

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(callbackUrl ?? new URL("/", nextUrl))
    }

    return null
  }

  if (!isLoggedIn && isProtected) {
    return Response.redirect(new URL(`/login?callbackUrl=${url}`, nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

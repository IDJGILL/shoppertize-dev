import { authQuery } from "~/vertex/lib/trpc/trpc-config"
import { getCheckoutSession } from "./checkout-controllers"

export const checkoutSessionQuery = authQuery(
  async (session) => await getCheckoutSession(session.user.id, session.user.email),
)

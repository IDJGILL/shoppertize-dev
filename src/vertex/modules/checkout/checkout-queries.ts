import { protectedQuery } from "~/vertex/lib/trpc/trpc-init"
import { getCheckoutSession } from "./checkout-controllers"

export const checkoutSessionQuery = protectedQuery(
  async (session) => await getCheckoutSession(session.user.id, session.user.email),
)

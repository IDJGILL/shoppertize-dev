import { createTRPCRouter, protectedProcedure } from "~/vertex/lib/trpc/trpc-config"
import { getAddressOptions } from "./address-server-utils"

export const addressRouter = createTRPCRouter({
  options: protectedProcedure.query(async ({ ctx }) => {
    return await getAddressOptions(ctx.session.user.id)
  }),
})

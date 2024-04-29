import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/vertex/lib/trpc/trpc-config"
import { nimbusAdapter } from "../lib/nimbus/nimbus-client"

export const testRouter = createTRPCRouter({
  public: publicProcedure.mutation(async () => {
    return await nimbusAdapter.serviceability(122001, 400018)
  }),

  protected: protectedProcedure.mutation(({ ctx }) => {
    return
  }),
})

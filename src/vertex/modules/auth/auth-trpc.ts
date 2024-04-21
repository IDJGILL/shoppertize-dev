import { cookies } from "next/headers"
import { waitAsync } from "~/lib/utils/functions/wait-async"
import { createTRPCRouter, publicProcedure } from "~/vertex/lib/trpc/trpc-init"

export const vertexAuthRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => {
    cookies().set("some-cookie", "some-cookie-value", {
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    })

    return ctx.session
  }),

  someData: publicProcedure.query(async () => {
    await waitAsync(2000)

    return "data"
  }),
})

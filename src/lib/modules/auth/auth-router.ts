import {
  $Verify,
  $UpdatePassword,
  $Signup,
  $Identify,
  $ForgetPassword,
  $AuthSessionId,
} from "./auth-schema"
import {
  forget,
  identify,
  resend,
  session,
  signup,
  status,
  update,
  verify,
} from "./auth-methods"
import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"

export const authRouter = createTRPCRouter({
  identify: publicProcedure.input($Identify).mutation(identify),

  verify: publicProcedure.input($Verify).mutation(verify),

  signup: publicProcedure.input($Signup).mutation(signup),

  resend: publicProcedure.input($AuthSessionId).mutation(resend),

  forgot: publicProcedure.input($ForgetPassword).mutation(forget),

  update: publicProcedure.input($UpdatePassword).mutation(update),

  session: publicProcedure.query(session),

  status: publicProcedure.input($AuthSessionId).query(status),
})

import type { Session } from "next-auth"
import type { ZodSchema } from "zod"
import { auth } from "../auth/auth-config"
import { ExtendedError } from "~/vertex/utils/extended-error"

export const authQuery = <TInput, TOutput>(
  schema: ZodSchema<TInput>,
  callback: (input: ZodSchema<TInput>["_output"], session: Session) => Promise<TOutput>,
) => {
  return async (input: ZodSchema<TInput>["_input"]) => {
    try {
      const session = await auth()

      if (!session) throw new ExtendedError({ code: "UNAUTHORIZED" })

      const data = await schema.parseAsync(input)

      return callback(data, session)
    } catch (error) {
      console.log(error)

      throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })
    }
  }
}

export const publicQuery = <TOutput>(callback: (session: Session | null) => Promise<TOutput>) => {
  return async () => {
    try {
      const session = await auth()

      return await callback(session)
    } catch (error) {
      console.log(error)
      throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })
    }
  }
}

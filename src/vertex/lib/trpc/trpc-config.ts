import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { type NextRequest } from "next/server"
import { auth } from "../auth/auth-config"

interface CreateContextOptions {
  headers: Headers
  resHeaders: Headers
  request: NextRequest
}

export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  const session = await auth()

  return {
    session: session,
    headers: opts.headers,
    request: opts.request,
    resHeaders: opts.resHeaders,
  }
}

export const createTRPCContext = async (opts: { req: NextRequest; resHeaders: Headers }) => {
  return await createInnerTRPCContext({
    headers: opts.req.headers,
    resHeaders: opts.resHeaders,
    request: opts.req,
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" })

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)

export type WrapTRPCSuccess<TData, TAction> = {
  data: TData
  message?: string
  action: "none" | TAction
}

export type WrapTRPCError = {
  status: false
  message?: string
  code: TRPCError["code"]
}

const successResponse = <TData, TAction>(options: Omit<WrapTRPCSuccess<TData, TAction>, "status">) => {
  return options satisfies WrapTRPCSuccess<TData, TAction>
}

const errorResponse = (options: Omit<WrapTRPCError, "status">) => {
  throw new TRPCError({ message: options.message, code: options.code })
}

type WrapTRPCCallback<TData, TAction> = (response: {
  success: typeof successResponse
  error: typeof errorResponse
}) => Promise<WrapTRPCSuccess<TData, TAction>>

export type WrapTRPCOptions = Locking

export type Locking = { id?: string; lock: true; lease: number; request: NextRequest } | { lock: false }

/**
 * @deprecated This helper needs to replaced by new trpc public and protected wrappers
 */
export const wrapTRPC = async <TData, TAction>(callback: WrapTRPCCallback<TData, TAction>) => {
  try {
    const response = {
      success: successResponse,
      error: errorResponse,
    }

    // if (options?.lock) {
    //   const ip = options.request.ip

    //   if (env.NODE_ENV === "production" && !ip) {
    //     throw new ExtendedError({
    //       code: "INTERNAL_SERVER_ERROR",
    //       message: "Client request is unknown.",
    //     })
    //   }

    //   const id = ip ?? options.id ?? "unknown"

    //   const lock = new Lock({
    //     id,
    //     lease: options.lease,
    //     redis: Redis.fromEnv(),
    //   })

    //   if (await lock.acquire()) {
    //     const data = await callback(response)

    //     await lock.release()

    //     return data
    //   } else {
    //     await lock.release()

    //     throw new ExtendedError({
    //       code: "TOO_MANY_REQUESTS",
    //     })
    //   }
    // }

    // if (options?.ratelimit) {
    //   const ip = options.request.ip

    //   if (env.NODE_ENV === "production" && !ip) {
    //     throw new ExtendedError({
    //       code: "INTERNAL_SERVER_ERROR",
    //       message: "Client request is unknown.",
    //     })
    //   }

    //   const id = ip ?? options.id ?? "unknown"

    //   const ratelimit = new Ratelimit({
    //     redis: Redis.fromEnv(),
    //     limiter: Ratelimit.slidingWindow(options.limit, options.duration),
    //   })

    //   const { success } = await ratelimit.limit(id)

    //   if (!success) {
    //     throw new ExtendedError({
    //       code: "TOO_MANY_REQUESTS",
    //       message: "Too many requests.",
    //     })
    //   }

    //   const requestData = await callback(response).catch(() => {
    //     throw new ExtendedError({
    //       code: "BAD_REQUEST",
    //       message: "The operation with this key is failed previously.",
    //     })
    //   })

    //   return requestData
    // }

    return await callback(response)
  } catch (error) {
    const trpcError = error as TRPCError

    return errorResponse({
      code: trpcError.code ?? "INTERNAL_SERVER_ERROR",
      message: trpcError.message ?? "Oops, Something went wrong!",
    })
  }
}

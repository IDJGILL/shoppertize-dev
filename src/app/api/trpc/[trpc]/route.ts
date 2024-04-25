import { env } from "~/env.mjs"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { type NextRequest } from "next/server"
import { createTRPCContext } from "~/vertex/lib/trpc/trpc-config"
import { appRouter } from "~/vertex/lib/trpc/trpc-router"

export const runtime = "edge"

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ resHeaders }) => createTRPCContext({ req, resHeaders }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
          }
        : undefined,
  })

export { handler as GET, handler as POST }

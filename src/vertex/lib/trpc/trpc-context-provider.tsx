"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import { getBaseUrl } from "~/lib/utils/functions/trpc"
import SuperJSON from "superjson"
import { type AppRouter } from "./trpc-router"

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let clientQueryClientSingleton: QueryClient | undefined = undefined

const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient()

  return (clientQueryClientSingleton ??= createQueryClient())
}

export const api = createTRPCReact<AppRouter>()

export function TRPCContextProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) => {
            return (
              process.env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error)
            )
          },
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,

          url: getBaseUrl() + "/api/trpc",

          headers: () => {
            const headers = new Headers()
            headers.set("x-trpc-source", "nextjs-react")
            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}

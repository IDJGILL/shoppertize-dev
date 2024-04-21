import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import { type AppRouter } from "../../trpc/trpc-router"
import { isDevEnv } from "./is-dev-env"
import { env } from "~/env.mjs"

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""

  if (isDevEnv()) return `http://localhost:${process.env.PORT ?? 3000}`

  return env.NEXT_PUBLIC_FRONTEND_DOMAIN
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc"
}

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>

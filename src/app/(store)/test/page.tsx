"use client"

import React from "react"
import { Button } from "~/app/_components/ui/button"
import { cn } from "~/lib/utils/functions/ui"
import { api } from "~/vertex/lib/trpc/trpc-context-provider"

export default function Test() {
  const publicApi = api.test.public.useMutation()

  const protectedApi = api.test.protected.useMutation()

  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-10">
        <Button onClick={() => publicApi.mutate()} loading={publicApi.isPending ? "true" : "false"}>
          Test Public Api
        </Button>

        <div
          className={cn("min-h-[100px] w-full border p-4", {
            "border-red-600": publicApi.isError,
            "opacity-55": publicApi.isPending,
          })}
        >
          <h2 className="mb-2">Public Test Results:</h2>

          {publicApi.isError ? (
            <pre>Error: {publicApi.error?.message}</pre>
          ) : (
            <pre>Data: {JSON.stringify(publicApi.data ?? null)}</pre>
          )}
        </div>

        <Button onClick={() => protectedApi.mutate()} loading={protectedApi.isPending ? "true" : "false"}>
          Test Protected Api
        </Button>

        <div
          className={cn("min-h-[100px] w-full border p-4", {
            "border-red-600": protectedApi.isError,
            "opacity-55": protectedApi.isPending,
          })}
        >
          <h2 className="mb-2">Protected Test Results:</h2>

          {protectedApi.isError ? (
            <pre>Error: {protectedApi.error?.message}</pre>
          ) : (
            <pre>Data: {JSON.stringify(protectedApi.data ?? null)}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

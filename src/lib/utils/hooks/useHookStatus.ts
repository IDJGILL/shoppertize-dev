import { useState } from "react"

type HookStatusState =
  | { status: "idl" | "loading"; message?: null }
  | { status: "error"; message: string }

export default function useHookStatus() {
  const [status, setStatus] = useState<HookStatusState>({ status: "idl" })

  const hookStatus = (status: HookStatusState) => {
    if (status.status === "loading" || status.status === "idl") {
      return setStatus({ ...status, message: null })
    }

    setStatus(status)
  }

  return {
    status,
    hookStatus,
  }
}

export type UseHookStatusOutputType = ReturnType<typeof useHookStatus>

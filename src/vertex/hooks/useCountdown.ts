import { useEffect, useState } from "react"
import { useUpdateEffect } from "react-use"

export type CountdownApis = {
  resetCountdown: (newDuration?: number) => void
}

export default function useCountDown(duration = 0, autoStart?: boolean) {
  const [remaining, remainingSet] = useState(duration)

  useEffect(() => {
    if (duration === 0 || !autoStart) return

    const interval = setInterval(() => {
      remainingSet((prev) => prev - 1)
    }, 1000)

    if (remaining === 0) {
      return clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [autoStart, duration, remaining])

  // useUpdateEffect(() => remainingSet(duration), [autoStart])

  const reset = (newDuration = 0) => remainingSet(newDuration)

  const isCompleted = remaining === 0

  return {
    reset,
    remaining,
    isCompleted,
  }
}

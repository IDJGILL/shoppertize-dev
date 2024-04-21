import { useEffect, useState } from "react"

export type CountdownApis = {
  resetCountdown: (newDuration?: number) => void
}

export default function useCountDown(duration = 0) {
  const [remaining, remainingSet] = useState(duration)

  useEffect(() => {
    if (duration === 0) return

    const interval = setInterval(() => {
      remainingSet((prev) => prev - 1)
    }, 1000)

    if (remaining === 0) {
      return clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [duration, remaining])

  const reset = (newDuration = 0) => remainingSet(newDuration)

  const isCompleted = remaining === 0

  return {
    reset,
    remaining,
    isCompleted,
  }
}

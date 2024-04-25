import { type PrimitiveAtom, useAtom } from "jotai"
import { useEffect, useState } from "react"
import { useUpdateEffect } from "react-use"

export type CountdownApis = {
  resetCountdown: (newDuration?: number) => void
}

export function useCountDown(atom: PrimitiveAtom<number>) {
  const [duration, durationSet] = useAtom(atom)
  const [remaining, remainingSet] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      remainingSet((prev) => prev - 1)
    }, 1000)

    if (remaining === 0 || duration === 0) {
      return clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [duration, remaining])

  const reset = (newDuration = 0) => {
    remainingSet(newDuration)
    durationSet(newDuration)
  }

  useUpdateEffect(() => remainingSet(duration), [duration])

  const isCompleted = remaining === 0

  return {
    reset,
    remaining,
    isCompleted,
  }
}

export function useCountDownAtom(atom: PrimitiveAtom<number>) {
  const [, durationSet] = useAtom(atom)

  return durationSet
}

import { type PrimitiveAtom, useAtom } from "jotai"
import { useEffect, useState } from "react"

type CountDownOptions = {
  seconds: number
  autoStart: boolean
  onComplete?: () => void
}

export function useCountdown(props: CountDownOptions) {
  const [autoStart, autoStartSet] = useState(props.autoStart)
  const [remaining, remainingSet] = useState(props.seconds)

  useEffect(() => {
    if (!autoStart) return

    const interval = setInterval(() => {
      remainingSet((prev) => prev - 1)
    }, 1000)

    if (remaining === 0) {
      return clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [autoStart, remaining])

  const start = () => autoStartSet(true)

  const restart = () => {
    remainingSet(props.seconds)
    autoStartSet(true)
  }

  const stop = () => autoStartSet(false)

  const reset = () => {
    remainingSet(props.seconds)
    autoStartSet(false)
  }

  const isCompleted = remaining === 0

  return {
    start,
    restart,
    stop,
    reset,
    remaining,
    isCompleted,
  }
}

export function useCountDownAtom(atom: PrimitiveAtom<number>) {
  const [, durationSet] = useAtom(atom)

  return durationSet
}

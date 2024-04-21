import { useEffect, useRef, useState, type ComponentType } from "react"

export type CountDownApiProps = {
  reset: (to?: number) => void
  isCompleted: boolean
}

type CountDownComponentProps = {
  count: number
  api: CountDownApiProps
}

interface CountDownProps {
  duration: number
  renderer: ComponentType<CountDownComponentProps>
  onCountDown?: (api: CountDownApiProps) => void
}

export default function CountDown({ ...props }: CountDownProps) {
  const [count, setCount] = useState(props.duration)

  const isApiUpdated = useRef<boolean>(true)

  const api = {
    reset: (to) => {
      setCount(to ?? props.duration)
      isApiUpdated.current = true
    },

    isCompleted: count === 0,
  } satisfies CountDownApiProps

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)

    if (count === 0) {
      props.onCountDown?.({ ...api, isCompleted: true })
      clearInterval(interval)
      return
    }

    if (isApiUpdated.current) {
      isApiUpdated.current = false

      props.onCountDown?.({ ...api, isCompleted: count === 0 })
    }

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return <props.renderer count={count} api={api} />
}

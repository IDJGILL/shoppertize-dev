"use client"

import { Provider } from "jotai"

interface JotaiProviderProps extends React.HTMLAttributes<HTMLElement> {}

export default function JotaiProvider({ ...props }: JotaiProviderProps) {
  const {} = props

  return <Provider>{props.children}</Provider>
}

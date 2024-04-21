import { useEffect, useState } from "react"

export type StoreProps<T, F> = {
  store: (callback: (state: T) => unknown) => unknown
  callback: (state: T) => F
}

export default function useStore<T, F>(props: StoreProps<T, F>) {
  const { store, callback } = props

  const result = store(callback) as F

  const [data, setData] = useState<F>()

  useEffect(() => setData(result), [result])

  return data
}

export type UseStoreOutputType = ReturnType<typeof useStore>

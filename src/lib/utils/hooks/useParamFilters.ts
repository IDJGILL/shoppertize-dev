import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { createQueryString } from "../functions/create-query-string"

export function useParamFilters(search: TransformedSearchParams) {
  const [params, setParams] = useState({ ...search.searchParams })
  const router = useRouter()

  const debounced = useDebouncedCallback(
    (value: DynamicObject<string[]> | null) => {
      if (value) {
        const queryString = createQueryString(params)

        router.replace(`?${queryString}`)
      }
    },
    100,
  )

  useEffect(() => debounced(params), [params, debounced])

  const handleParams = (key: string, values: Array<string>) => {
    setParams((prev) => ({
      ...prev,
      [key]: values,
    }))
  }

  return handleParams
}

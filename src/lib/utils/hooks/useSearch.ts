import { useCallback, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import useScrollLock from "./useScrollLock"
import { type UseTRPCMutationResult } from "@trpc/react-query/shared"
import { storeNavigations } from "../constants/navigations"
import { useUpdateEffect } from "react-use"
import { type SearchTerm } from "~/lib/modules/product/utils/product-types"

export type SearchProps<TError, TContext> = {
  api: UseTRPCMutationResult<SearchTerm[], TError, void | undefined, TContext>
  autoClose?: boolean
  maxResults?: number
  onClose?: () => void
}

export default function useSearch<TError, TContext>(
  props: SearchProps<TError, TContext>,
) {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<SearchTerm[]>([])
  const [isResultBoxOpen, setResultBox] = useState(false)
  const [isBackdropApplied, setBackDrop] = useState(false)

  const { mutate, data, isLoading } = props.api

  const router = useRouter()

  const searchData: SearchTerm[] = useMemo(() => data ?? [], [data])

  const { lockScroll, unlockScroll } = useScrollLock()

  const getSearchTerms = useCallback(() => {
    if (isBackdropApplied) return

    mutate(undefined)
  }, [mutate, isBackdropApplied])

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    value: input,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onInput: async (e) => {
      setInput(e.currentTarget.value)

      const text = e.currentTarget.value

      if (text.length >= 4) {
        const Fuse = (await import("fuse.js")).default

        const fuse = new Fuse(searchData, {
          includeScore: true,
          keys: ["tags"],
          minMatchCharLength: 4,
          threshold: 0.4,
          distance: 200,
        })

        const searchResults = fuse.search(text ?? input)

        setResults(searchResults.map((result) => result.item))

        return setResultBox(true)
      }

      setResultBox(false)
    },
    onBlur: () => !isResultBoxOpen && setResultBox(false),
    onFocus: () => {
      setBackDrop(true)
      lockScroll()
      getSearchTerms()
    },
  }

  const dropDownProps: React.HTMLAttributes<HTMLDivElement> = {
    onClick: () => setResultBox(true),
  }

  const close = useCallback(() => {
    setBackDrop(false)
    setResultBox(false)
    unlockScroll()
    setInput("")

    !!props.onClose && props.onClose()
  }, [unlockScroll])

  const path = usePathname()

  const searchTrigger = () => {
    const relevantSearch = results[0]

    if (relevantSearch) {
      const slug = (relevantSearch as unknown as { slug: string }).slug

      router.push(storeNavigations.dynamic.shop.path(slug))
    }
  }

  useUpdateEffect(() => {
    if (!!props?.autoClose) {
      close()
    }
  }, [path, props?.autoClose])

  const resultMessage =
    input.length === 0
      ? "Start typing to see results..."
      : results.length === 0
        ? "No results found"
        : null

  return {
    results: results.slice(0, props?.maxResults ?? 8),
    inputProps,
    dropDownProps,
    close,
    resultMessage,
    isResultBoxOpen,
    isLoading,
    searchTrigger,
    isBackdropApplied,
  }
}

export type UseSearchOutputType<TError, TContext> = ReturnType<
  typeof useSearch<TError, TContext>
>

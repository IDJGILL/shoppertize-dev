import { type UseTRPCInfiniteQueryResult } from "@trpc/react-query/shared"
import { useState, useCallback, useMemo } from "react"

type InfiniteData<T = unknown> = {
  data: T[]
  nextCursor: string | undefined
  hasNextPage: boolean
  hasPreviousPage: boolean
  found: number
}

export type InfiniteDataProps<TData extends InfiniteData, TError> = {
  api: UseTRPCInfiniteQueryResult<TData, TError>
}

export default function useInfiniteData<TData extends InfiniteData, TError>(
  props: InfiniteDataProps<TData, TError>,
) {
  const { api } = props

  const {
    data,
    error,
    isFetching,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = api

  const [pageIndex, setPageIndex] = useState(1)

  const all = data?.pages.flatMap((a) => a.data) as TData["data"]

  const current = useMemo(
    () => data?.pages[pageIndex - 1]?.data as TData["data"],
    [data?.pages, pageIndex],
  )

  const hasNextPage = data?.pages[pageIndex - 1]?.hasNextPage

  const hasPreviousPage = data?.pages[pageIndex - 1]?.hasPreviousPage

  const found = data?.pages[pageIndex - 1]?.found

  const isStart = pageIndex === 1

  const isLast = hasNextPage === false

  const canFetchNext = hasNextPage && !isFetchingNextPage

  const isNextDisabled = isLast || isFetchingNextPage

  const isBackDisabled = isStart || isFetchingNextPage

  const isLoadMoreDisabled = isLast || isFetchingNextPage || !hasNextPage

  const isNoResults = all?.length === 0

  const next = useCallback(async () => {
    canFetchNext && (await fetchNextPage())
    !isNextDisabled && setPageIndex((old) => old + 1)
  }, [canFetchNext, isNextDisabled, fetchNextPage])

  const back = () => {
    !isBackDisabled && setPageIndex((old) => Math.max(old - 1, 1))
  }

  const loadMore = async () => {
    !isLoadMoreDisabled && (await fetchNextPage())
    !isNextDisabled && setPageIndex((old) => old + 1)
  }

  return {
    next,
    back,
    loadMore,
    isStart,
    isLast,
    current,
    pageIndex,
    isNextDisabled,
    isBackDisabled,
    isLoadMoreDisabled,
    isFetching,
    data,
    all,
    isLoading,
    error,
    found,
    hasPreviousPage,
    isNoResults,
  }
}

export type UseInfiniteDataOutputType<TData> = ReturnType<
  typeof useInfiniteData<InfiniteData<TData>, unknown>
>

import { useMemo } from "react"

export type SortProps<T> = {
  unSortedData: BaseSortFieldProps<T>[]
  sortFilter: SortFilter
}

type BaseSortFieldProps<T> = {
  name: string
  date: string
  price: string
} & T

export default function useSort<T>(props: SortProps<T>) {
  const { unSortedData, sortFilter } = props

  const sortedData = useMemo(() => {
    if (!sortFilter || !unSortedData) return unSortedData

    return sortData({ data: unSortedData, sortFilter })
  }, [sortFilter, unSortedData]) as T

  return sortedData as SortProps<T>["unSortedData"]
}

export type UseSortOutputType = ReturnType<typeof useSort>

export const sortData = <TData>(options: {
  sortFilter: SortFilter
  data: BaseSortFieldProps<TData>[]
}) => {
  const { sortFilter, data } = options

  const orderBy = sortFilter.field.toLowerCase() as "date" | "name" | "price"

  const sort = sortFilter.order.toLowerCase() as "asc" | "desc"

  const sortOrder = sort === "asc" ? 1 : -1

  const sorted = data.slice().sort((a, b) => {
    const aValue =
      orderBy === "date"
        ? new Date(a[orderBy])
        : orderBy === "price"
          ? +a[orderBy]
          : a[orderBy]
    const bValue =
      orderBy === "date"
        ? new Date(b[orderBy])
        : orderBy === "price"
          ? +b[orderBy]
          : b[orderBy]

    if (aValue < bValue) {
      return -1 * sortOrder
    } else if (aValue > bValue) {
      return 1 * sortOrder
    } else {
      return 0
    }
  })

  return sorted
}

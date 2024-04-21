"use client"

import { useEffect } from "react"
import { useProductHistory } from "~/app/_lib/product-history-store"

interface AddToHistoryProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function AddToHistory({ ...props }: AddToHistoryProps) {
  const { product } = props

  const store = useProductHistory()

  useEffect(() => store.add(product), [])

  return null
}

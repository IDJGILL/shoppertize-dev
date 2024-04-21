export type FormatPriceProps = {
  price: string | number
  decimals?: number
  prefix?: string
  suffix?: string
}

export const formatPrice = (options: FormatPriceProps) => {
  let amount = ""

  if (typeof options.price === "string") {
    const price = (+(+options.price).toFixed(
      options.decimals ?? 0,
    )).toLocaleString()

    amount = price
  }

  if (typeof options.price === "number") {
    const price = (+options.price.toFixed(
      options.decimals ?? 0,
    )).toLocaleString()

    amount = price
  }

  return (options.prefix ?? "") + amount + (options.suffix ?? "")
}

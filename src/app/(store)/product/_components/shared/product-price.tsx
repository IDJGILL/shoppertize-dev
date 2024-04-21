import { currency } from "~/constants"
import { formatPrice } from "~/lib/utils/functions/format-price"

interface ProductPriceProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ProductPrice({ ...props }: ProductPriceProps) {
  const { product } = props

  if (product.type === "SIMPLE") {
    return (
      <div>
        <div className="mb-2 flex items-baseline gap-4">
          <div className="text-2xl font-light leading-none text-red-500">
            -
            {Math.floor(
              ((+product.regularPrice - +product.price) /
                +product.regularPrice) *
                100,
            )}
            %
          </div>

          <div className="relative text-3xl leading-none">
            <span className="absolute -left-[8px] top-0 text-sm">
              {currency}
            </span>{" "}
            {formatPrice({ price: product.price })}
            <span className="absolute -right-[16px] top-0 text-sm">00</span>
          </div>
        </div>

        <div className="mb-1 text-sm leading-none text-muted-foreground">
          M.R.P.:
          <span className="line-through">
            {currency}
            {formatPrice({ price: product.regularPrice })}
          </span>
        </div>

        <p className="mb-1 text-xs text-muted-foreground">
          Inclusive of all taxes
        </p>

        {/* <p className="text-sm leading-none">
          <span className="">Grab exclusive deals & offers </span>
          at the time of checking out.
        </p> */}
      </div>
    )
  }

  if (product.type === "VARIABLE") {
    const variation = product.variations.nodes[0]!
    return (
      <div className="mt-3">
        <span className="mr-2 text-sm ">
          {currency}
          {variation.price}
        </span>
        <span className="mr-1 text-xs text-muted-foreground line-through sm:text-sm">
          {currency}
          {variation.regularPrice}
        </span>

        <span className="text-xs text-green-500 sm:text-sm">
          (
          {Math.floor(
            ((+variation.regularPrice - +variation.price) /
              +variation.regularPrice) *
              100,
          )}
          % off)
        </span>
      </div>
    )
  }

  return null
}

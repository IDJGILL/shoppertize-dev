"use client"

import Link from "next/link"
import { currency } from "~/constants"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"
import ProductImage from "./product-image"
import { formatPrice } from "~/lib/utils/functions/format-price"
import { Star } from "lucide-react"

interface ProductCardProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ProductCard({ ...props }: ProductCardProps) {
  const { product } = props

  return (
    <div className="h-full md:px-1 md:py-4">
      <Link
        className={cn(
          "relative flex h-full max-h-max w-full select-none flex-col gap-2 overflow-hidden rounded bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] will-change-scroll hover:z-30 md:hover:shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]",
          props.className,
        )}
        href={storeNavigations.dynamic.product.path(product.slug)}
      >
        <ProductImage
          sourceUrl={product.image.sourceUrl}
          lazyLoad
          className="px-4"
        />

        <div className="grid gap-3 p-3 md:px-5 md:pb-5 md:pt-2">
          <h4 className="line-clamp-2 text-xs md:text-sm">{product.name}</h4>

          <ProductPrice product={product} />
        </div>

        {/* <WishlistButton product={product} /> */}
      </Link>
    </div>
  )
}

interface ProductPriceProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

function ProductPrice({ ...props }: ProductPriceProps) {
  const { product } = props

  if (product.type === "SIMPLE") {
    return (
      <div className="flex flex-col items-baseline gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {product.reviews.averageRating >= 1 && (
              <div className="flex h-max w-max items-center gap-1 rounded bg-green-800 px-1 py-[4px] text-[10px] leading-none text-white">
                {product.reviews.averageRating}
                <Star className="h-[10px] w-[10px] fill-white" />
              </div>
            )}

            <p className="text-base font-medium md:text-xl">
              {currency}
              {formatPrice({ price: product.price })}
            </p>
          </div>

          <div className="flex gap-2 text-sm">
            <div className="text-muted-foreground line-through">
              {currency}
              {formatPrice({ price: product.regularPrice })}
            </div>

            <div className="text-green-800">
              {Math.floor(
                ((+product.regularPrice - +product.price) /
                  +product.regularPrice) *
                  100,
              )}
              % off
            </div>
          </div>
        </div>

        {/* {product.reviewCount >= 1 && (
          <div className="flex items-center gap-2">
            <div className="max-w-[80px] md:max-w-[90px]">
              <Rating type="static" default={product.reviews.averageRating} />
            </div>
            <span className="text-sm leading-none">{product.reviewCount}</span>
          </div>
        )} */}
      </div>
    )
  }

  if (product.type === "VARIABLE") {
    const variation = product.variations.nodes[0]!
    return (
      <div className="mt-2">
        <span className="mr-1 text-sm font-medium">
          {currency}
          {variation.price}
        </span>

        <span className="mr-2 text-sm text-muted-foreground line-through">
          {currency}
          {variation.regularPrice}
        </span>

        <span className="text-xs text-green-500">
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

// interface WishlistButtonProps extends React.HTMLAttributes<HTMLElement> {
//   product: Product
// }

// function WishlistButton({ ...props }: WishlistButtonProps) {
//   const store = useWishlist()

//   const isExitInWishlist = store.products.some((a) => a.id === props.product.id)

//   return (
//     <div
//       onClick={() => {
//         if (isExitInWishlist) {
//           return store.remove(props.product.id)
//         }

//         store.add(props.product)
//       }}
//       className={cn(
//         "absolute right-2 top-2 z-10 flex h-[34px] w-[34px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white shadow",
//       )}
//     >
//       <Heart
//         className={cn("hover:stroke-secondary", {
//           "fill-secondary stroke-secondary": isExitInWishlist,
//         })}
//       />
//     </div>
//   )
// }

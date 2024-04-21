import { Heart } from "lucide-react"
import Link from "next/link"
import ProductImage from "~/app/_components/product-image"
import Rating from "~/app/_components/ui/rating"
import { useWishlist } from "~/app/_lib/wishlist-store"
import { currency } from "~/constants"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"

interface ProductCarouselCardProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ProductCarouselCard({
  ...props
}: ProductCarouselCardProps) {
  const { product } = props

  return (
    <div
      className={cn(
        "relative flex h-full max-h-max max-w-xs select-none flex-col gap-2 overflow-hidden bg-white will-change-transform",
        props.className,
      )}
    >
      <Link href={storeNavigations.dynamic.product.path(product.slug)}>
        <>
          <ProductImage sourceUrl={product.image.sourceUrl} lazyLoad />

          <div className="grid gap-3 pt-5">
            <h4 className="line-clamp-2 text-sm">{product.name}</h4>

            <ProductPrice product={product} />
          </div>
        </>
      </Link>

      <WishlistButton product={product} />
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
          <div className="flex">
            <p className="text-lg md:text-xl">
              {currency}
              {product.price}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="text-muted-foreground line-through">
              {currency}
              {product.regularPrice}
            </div>

            <div className="text-green-700">
              {Math.floor(
                ((+product.regularPrice - +product.price) /
                  +product.regularPrice) *
                  100,
              )}
              % off
            </div>
          </div>
        </div>

        {product.reviewCount >= 1 && (
          <div className="flex items-center gap-2">
            <div className="max-w-[80px] md:max-w-[90px]">
              <Rating type="static" default={product.reviews.averageRating} />
            </div>
            <span className="text-sm leading-none">{product.reviewCount}</span>
          </div>
        )}
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

interface WishlistButtonProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

function WishlistButton({ ...props }: WishlistButtonProps) {
  const store = useWishlist()

  const isExitInWishlist = store.products.some((a) => a.id === props.product.id)

  return (
    <div
      onClick={() => {
        if (isExitInWishlist) {
          return store.remove(props.product.id)
        }

        store.add(props.product)
      }}
      className={cn(
        "absolute right-2 top-2 z-10 flex h-[34px] w-[34px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white shadow",
      )}
    >
      <Heart
        className={cn("hover:stroke-secondary", {
          "fill-secondary stroke-secondary": isExitInWishlist,
        })}
      />
    </div>
  )
}

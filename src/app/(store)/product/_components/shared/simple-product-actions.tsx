"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/app/_components/ui/button"
import Spinner from "~/app/_components/ui/spinner"
import { useWishlist } from "~/app/_lib/wishlist-store"
import { accountNavigations } from "~/lib/utils/constants/navigations"
import { cn } from "~/lib/utils/functions/ui"
import { type UseSimpleProductActions } from "~/lib/utils/hooks/useSimpleProductActions"
import useStore from "~/lib/utils/hooks/useStore"

interface SimpleProductActionsProps extends React.HTMLAttributes<HTMLElement> {
  utils: UseSimpleProductActions
  product: Product
}

export default function SimpleProductActions({
  ...props
}: SimpleProductActionsProps) {
  const { utils, product } = props

  const isAddedToWishlist = useStore({
    store: useWishlist,
    callback: (store) => store.products.some((a) => a.id === product.id),
  })

  const store = useWishlist()

  const router = useRouter()

  if (utils.product.stockStatus === "OUT_OF_STOCK") {
    return (
      <div className="flex h-12 items-center justify-center rounded border text-red-600">
        Out of stock
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-4", props.className)}>
      <Button
        className="flex-1"
        onClick={async () => {
          if (utils.addedToCart) {
            return router.push("/cart")
          }

          await utils.addToCart()
        }}
        disabled={utils.isLoading}
        variant="secondary"
      >
        {utils.isLoading ? (
          <Spinner />
        ) : (
          <>
            <ShoppingCart
              className={cn("mr-3 h-5 w-5 stroke-2", {
                "fill-white": utils.addedToCart,
              })}
            />{" "}
            {utils.addedToCart ? "Go to Cart" : "Add to Cart"}
          </>
        )}
      </Button>

      <Button
        className="flex-1 hover:bg-slate-50"
        variant="outline"
        onClick={() => {
          if (isAddedToWishlist) {
            return router.push(accountNavigations.static.wishlist.path)
          }

          return store.add(product)
        }}
      >
        <Heart
          className={cn("mr-3 h-5 w-5 stroke-2", {
            "fill-secondary stroke-secondary": isAddedToWishlist,
          })}
        />

        {isAddedToWishlist ? "Wishlisted" : "Wishlist"}
      </Button>
    </div>
  )
}

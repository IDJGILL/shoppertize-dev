"use client"

import React from "react"
import AccountSectionWrapper from "../_components/account-section-wrapper"
import { useWishlist } from "~/app/_lib/wishlist-store"
import ProductCard from "~/app/_components/product-card"
import ErrorFallback from "~/app/_components/error-fallback"

export default function WishlistPage() {
  const store = useWishlist()

  return (
    <AccountSectionWrapper
      title="My Wishlist"
      sub="View, add and move to cart"
      className="max-w-2xl"
    >
      {store.products.length === 0 && (
        <ErrorFallback
          options={{
            title: "It's Empty",
            sub: "Looks like haven't added any product to wishlist yet, start adding now.",
            buttonLabel: "Add Products",
            buttonLink: "/",
          }}
          className="h-[400px]"
        />
      )}
      <ul className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
        {store.products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </ul>
    </AccountSectionWrapper>
  )
}

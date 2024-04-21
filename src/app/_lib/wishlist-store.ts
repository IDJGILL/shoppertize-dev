import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  products: Product[]
  add: (product: Product) => void
  remove: (id: string) => void
  reset: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set) => ({
      products: [],
      add: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            ...(state.products.some((a) => a.id === product.id)
              ? []
              : [product]),
          ],
        })),
      remove: (id) =>
        set((state) => ({
          products: state.products.filter((a) => a.id !== id),
        })),
      reset: () => set(() => ({ products: [] })),
    }),
    { name: "shopper-wishlist" },
  ),
)

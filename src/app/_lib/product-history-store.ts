import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ProductHistoryStore {
  products: Product[]
  add: (product: Product) => void
  reset: () => void
}

export const useProductHistory = create<ProductHistoryStore>()(
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
      reset: () => set(() => ({ products: [] })),
    }),
    { name: "shopper-browsing-history" },
  ),
)

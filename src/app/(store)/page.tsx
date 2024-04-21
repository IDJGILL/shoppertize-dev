import { ProductCarousel } from "~/lib/modules/carousel/components"
import Banners from "../_components/banners"

export const dynamic = "error"

export default function Home() {
  return (
    <main>
      <section className="mb-8">
        <Banners />
      </section>

      <section className="sm:container">
        <ProductCarousel
          options={{
            title: "All Products",
            category: "all-products",
            type: "dynamic",
          }}
          className="mb-12"
        />

        <ProductCarousel
          options={{
            title: "Computers & Accessories",
            category: "computers-and-accessories",
            type: "dynamic",
          }}
          className="mb-12"
        />

        <ProductCarousel
          options={{
            title: "Home & Kitchen",
            category: "home-kitchen",
            type: "dynamic",
          }}
          className="mb-12"
        />
      </section>
    </main>
  )
}

import { Suspense } from "react"
import FilterProductsRsc from "~/lib/modules/shop/components/shop-products-rsc"
import { getCollectionSlugs } from "~/lib/modules/shop/utils/shop-apis"
import ShopWrapperRsc from "~/lib/modules/shop/components/shop-wrapper-rsc"
import FiltersRenderer from "../_components/filters-renderer"
import LoaderFallBack from "~/app/_components/loader-fallback"
import ShopHeader from "../_components/shop-header"

// export const dynamic = "force-static"

export default function ShopPage(search: ServerComponentParams) {
  return ShopWrapperRsc(search, () => (
    <main className="min-h-[80dvh]">
      <ShopHeader />

      <div className="container p-0 md:px-4">
        <div className="md:flex md:gap-8">
          <FiltersRenderer />

          <Suspense fallback={<LoaderFallBack className="h-screen w-full" />}>
            <FilterProductsRsc search={search} />
          </Suspense>
        </div>
      </div>
    </main>
  ))
}

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs()

  return slugs
}

import { createTaxonomyFilter, getCollectionProducts } from "../utils/shop-apis"
import ShopProductsGrid from "./shop-products-grid"

interface FilterProductsRscProps extends React.HTMLAttributes<HTMLElement> {
  search: ServerComponentParams
}

export default async function FilterProductsRsc({
  ...props
}: FilterProductsRscProps) {
  const { search } = props

  const taxonomyFilter = createTaxonomyFilter({
    slug: search.params.slug ?? "",
    include: null,
    search: null,
  })

  const data = await getCollectionProducts({ taxonomyFilter })

  return (
    <div className="md:w-[80%] md:py-5">
      <ShopProductsGrid initialData={data} />
    </div>
  )
}

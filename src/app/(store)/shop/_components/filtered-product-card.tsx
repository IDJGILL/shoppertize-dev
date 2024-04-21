import ProductCard from "~/app/_components/product-card"
import useVariationCard from "~/lib/utils/hooks/useVariationCard"

interface FilteredProductCardProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
  search: TransformedSearchParams
}

export default function FilteredProductCard({
  ...props
}: FilteredProductCardProps) {
  const { product, search } = props

  if (product.type === "SIMPLE") {
    return <SimpleProduct product={product} />
  }

  if (product.type === "VARIABLE") {
    return <VariationProduct product={product} search={search} />
  }

  return null
}

interface SimpleProductProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

function SimpleProduct({ ...props }: SimpleProductProps) {
  return <ProductCard product={props.product} />
}

interface VariationProductProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
  search: TransformedSearchParams
}

function VariationProduct({ ...props }: VariationProductProps) {
  const { product, subVarianFilter } = useVariationCard({
    product: props.product as VariableProduct,
    search: props.search,
  })

  return product.variations.nodes.map((variation) => {
    const p = subVarianFilter(variation)

    if (!p) return null

    return (
      <ProductCard
        key={variation.id}
        product={{ ...props.product, ...(p as unknown as Product) }}
      />
    )
  })
}

// export function VariationCards({ ...props }: VariationCardsProps) {
//   const { product, subVarianFilter } = useVariationCard({
//     product: props.product,
//     search: props.search,
//   })

//   return (
//     <>
//       {product.variations.nodes.map((variation) => (
//         <VariationCard
//           key={variation.id}
//           product={props.product}
//           variation={variation}
//           subVarianFilter={subVarianFilter}
//         />
//       ))}
//     </>
//   )
// }

// interface VariationCardProps extends React.HTMLAttributes<HTMLElement> {
//   product: VariableProduct
//   variation: Variation
//   subVarianFilter: UseVariationCard["subVarianFilter"]
// }

// export function VariationCard({ ...props }: VariationCardProps) {
//   const { variation, subVarianFilter } = props

//   const p = subVarianFilter(variation)

//   if (!p) return null

//   return (
//     <Link href={p.slug} className="border p-4">
//       <div>
//         <Image src={p.image.sourceUrl} alt="" width={500} height={500} />
//         <h2 className="mb-4">{p.name}</h2>

//         <div>{p.id}</div>

//         <div className="4">
//           <span className="mr-2">{p.regularPrice}</span>
//           <span>{p.price}</span>
//         </div>
//       </div>
//     </Link>
//   )
// }

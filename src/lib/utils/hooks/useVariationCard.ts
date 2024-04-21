export type VariationCardProps = {
  product: VariableProduct
  search: TransformedSearchParams
}

export default function useVariationCard(props: VariationCardProps) {
  const { search, product } = props

  const searchParams = search.searchParams

  const subVarianFilter = (variation: Variation) => {
    // const dynamicSlug = storeNavigations.dynamic.product.path(product.slug)

    const encodeVariationUrl = (variationId: string) => {
      return `${product.slug}?variant=${variationId}`
    }

    if (!search.searchParams) {
      return { ...variation, slug: product.slug }
    }

    const searchKeys = Object.keys(search.searchParams).filter(
      (key) => key !== "cat",
    )

    const baseVariant = variation.attributes.nodes[0]

    const hasSubVariant = variation.attributes.nodes[1]
      ? searchKeys.includes(variation.attributes.nodes[1].name)
      : null

    if (baseVariant && hasSubVariant) {
      const subVariantName = variation.attributes.nodes[1]?.name

      if (!subVariantName) return null

      const subVariant = search.searchParams[subVariantName]

      if (!subVariant) return null

      const subVariantValue = subVariant[0]

      const filteredVariation =
        product.variations.nodes.find(
          (item) =>
            item.attributes.nodes.some(
              (att) =>
                att.name === baseVariant.name &&
                att.value === baseVariant.value,
            ) &&
            item.attributes.nodes.some(
              (att) =>
                att.name === subVariantName && att.value === subVariantValue,
            ),
        ) ?? null

      if (!filteredVariation) return null

      return {
        ...filteredVariation,
        slug: encodeVariationUrl(filteredVariation.id),
      }
    }

    return { ...variation, slug: encodeVariationUrl(variation.id) }
  }

  if (!searchParams) {
    const variation = product.variations.nodes[0]

    return {
      product: {
        ...product,
        variations: {
          nodes: variation ? [variation] : [],
        },
      } satisfies VariableProduct,
      subVarianFilter,
    }
  }

  const searchKeys = Object.keys(searchParams).filter((key) => key !== "cat")

  const variations = product.variations.nodes
    .filter(
      (variation) =>
        searchKeys.find(
          (item) => item === variation.attributes.nodes[0]?.name,
        ) &&
        searchParams[variation.attributes.nodes[0]?.name ?? ""]?.includes(
          variation.attributes.nodes[0]?.value ?? "",
        ),
    )
    .filter(
      (obj, index, self) =>
        index ===
        self.findIndex(
          (o) =>
            o.attributes.nodes[0]?.value === obj.attributes.nodes[0]?.value,
        ),
    )
    .map((item) => ({
      ...item,
    }))

  const filteredVariation =
    variations.length === 0
      ? product.variations.nodes[0]
        ? [product.variations.nodes[0]]
        : []
      : variations

  return {
    product: {
      ...product,
      variations: {
        nodes: filteredVariation,
      },
    } satisfies VariableProduct,
    subVarianFilter,
  }
}

export type UseVariationCard = ReturnType<typeof useVariationCard>

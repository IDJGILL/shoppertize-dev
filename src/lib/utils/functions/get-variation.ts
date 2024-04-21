export function getVariation(
  product: VariableProduct,
  search: TransformedSearchParams,
): Variation {
  if (!search.searchParams) return product.variations.nodes[0]!;

  const variationId = search.searchParams.variant
    ? search.searchParams.variant[0]
    : null;

  if (!variationId) return product.variations.nodes[0]!;

  const variation = product.variations.nodes.find(
    (variation) => variation.id.toLowerCase() === variationId.toLowerCase(),
  );

  if (!variation) return product.variations.nodes[0]!;

  return variation;
}

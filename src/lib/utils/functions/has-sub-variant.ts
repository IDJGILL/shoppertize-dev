export const hasSubVariant = (product: VariableProduct) => {
  return product.attributes.nodes.length > 1;
};

export const extractPrice = (price: string) => {
  return parseFloat(price.replace(/[^0-9.-]+/g, ''));
};

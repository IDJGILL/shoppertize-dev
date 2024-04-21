export const extractCurrencySymbol = (price: string) => {
  const currencySymbolMatch = price.match(/[^\d,.]+/);
  const currencySymbol = currencySymbolMatch ? currencySymbolMatch[0] : '';
  return currencySymbol;
};

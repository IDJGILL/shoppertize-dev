export const calculateGst = (price: number, taxClass: string) => {
  const tax = taxClass.match(/\d+/);

  if (!tax) return 0;

  const taxRate = parseInt(tax[0]);

  const gstAmount = (price / (100 + taxRate)) * taxRate;

  return gstAmount;
};

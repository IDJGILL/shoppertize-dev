export const getStockMessage = (
  stockStatus: StockStatus,
  stockQuantity: number,
  lowStockAmount: number,
) => {
  if (stockStatus === "OUT_OF_STOCK") {
    return "Out of stock";
  }

  if (stockQuantity <= lowStockAmount) {
    return `Hurry up! only ${Math.min(lowStockAmount, stockQuantity)} ${
      stockQuantity === 1 ? "item" : "items"
    } left in stock.`;
  }

  return null;
};

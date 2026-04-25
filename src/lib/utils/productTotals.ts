const round2 = (n: number) => Math.round(n * 100) / 100;

/*
 * Calculates the subtotal and profit for a product based on unit price, purchase price, and quantity
 * @param unitPrice - The selling price per unit
 * @param purchasePrice - The cost price per unit
 * @param quantity - The number of units being sold
 * @returns An object containing the subtotal and profit
 */
export function calculateProductTotals(
  unitPrice: number,
  purchasePrice: number,
  quantity: number,
): { subtotal: number; profit: number } {
  return {
    subtotal: round2(unitPrice * quantity),
    profit: round2((unitPrice - purchasePrice) * quantity),
  };
}

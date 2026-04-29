const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Calculates product totals and metrics based on pricing and quantity.
 * Returns values grouped by storage necessity: those persisted to DB and computed metrics for UI display.
 *
 * @param unitPrice - Selling price per unit
 * @param purchasePrice - Cost price per unit
 * @param quantity - Number of units
 * @returns Object containing:
 *   - storedTotals: Values persisted to database (subtotal, profit)
 *   - computedMetrics: Calculated metrics for display only (profitPerUnit, marginPercent, totalCost)
 */
export function calculateProductTotals(
  unitPrice: number,
  purchasePrice: number,
  quantity: number,
): {
  storedTotals: {
    subtotal: number;
    profit: number;
  };
  computedMetrics: {
    profitPerUnit: number;
    marginPercent: number;
    totalCost: number;
  };
} {
  const profitPerUnit = round2(unitPrice - purchasePrice);
  const profit = round2(profitPerUnit * quantity);

  return {
    storedTotals: {
      subtotal: round2(unitPrice * quantity),
      profit,
    },
    computedMetrics: {
      profitPerUnit,
      marginPercent:
        purchasePrice > 0 ? round2((profitPerUnit / purchasePrice) * 100) : 0,
      totalCost: round2(purchasePrice * quantity),
    },
  };
}

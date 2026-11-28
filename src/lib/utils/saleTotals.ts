import { Payment, Product } from "@/generated/prisma/client";
import { round2 } from "./productTotals";

type SaleTotalsInput = {
  products: Pick<Product, "subtotal" | "profit">[];
  payments: Pick<Payment, "amount">[];
};

/**
 * Calculates sale totals from its products and payments.
 * Note: Surcharges are not implemented yet, so totalAmount equals productAmount.
 *
 * @param sale - object with the sale's products (subtotal, profit) and payments (amount).
 * @returns amounts and counts, e.g. `{totalAmount: 120, totalBalance: 20, ...}`.
 */
export function getSaleTotals({ products, payments }: SaleTotalsInput) {
  const productAmount = round2(
    products.reduce((sum, p) => sum + p.subtotal, 0),
  );
  const totalProfit = round2(products.reduce((sum, p) => sum + p.profit, 0));
  const paymentAmount = round2(payments.reduce((sum, p) => sum + p.amount, 0));
  const totalAmount = productAmount;

  return {
    productAmount,
    productCount: products.length,
    paymentAmount,
    paymentCount: payments.length,
    totalAmount,
    totalBalance: round2(totalAmount - paymentAmount),
    totalProfit,
  };
}

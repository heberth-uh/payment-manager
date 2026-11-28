import { Prisma } from "@/generated/prisma/client";
import { getSaleTotals } from "@/lib/utils/saleTotals";

/**
 * Returns the latest date of a given list, or null when it is empty
 */
function maxDate(dates: Date[]): Date | null {
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

/**
 * Recalculates and stores the sale's status, lastSaleDate and lastPaymentDate.
 * Must run inside the same transaction as the change that triggered it.
 * Assumes the caller already verified the sale belongs to the session user.
 *
 * @param tx - Prisma transaction client
 * @param saleId - id of the sale to sync
 * @returns the updated sale
 */
export async function syncSaleState(
  tx: Prisma.TransactionClient,
  saleId: string,
) {
  const sale = await tx.sale.findUniqueOrThrow({
    where: { id: saleId },
    select: {
      status: true,
      createdAt: true,
      products: { select: { subtotal: true, profit: true, saleDate: true } },
      payments: { select: { amount: true, paymentDate: true } },
    },
  });

  // Status: CANCELED is manual and sticky; otherwise PAID when fully paid
  const { productCount, totalBalance } = getSaleTotals(sale);
  const status =
    sale.status === "CANCELED"
      ? "CANCELED"
      : productCount > 0 && totalBalance <= 0
        ? "PAID"
        : "PENDING";

  // Dates: latest product/payment date
  const lastSaleDate =
    maxDate(sale.products.map((p) => p.saleDate)) ?? sale.createdAt;
  const lastPaymentDate = maxDate(sale.payments.map((p) => p.paymentDate));

  return tx.sale.update({
    where: { id: saleId },
    data: {
      status,
      lastSaleDate,
      lastPaymentDate,
    },
  });
}

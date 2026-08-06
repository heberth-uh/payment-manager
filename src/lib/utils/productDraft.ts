import { Product } from "@/generated/prisma/client";
import { ProductDraftData } from "../validations/product.schema";
import { calculateProductTotals } from "./productTotals";
import { extractDateOnly } from "./date";

// Convert a Product to a ProductDraftData
export function productToDraft(product: Product): ProductDraftData {
  return {
    id: product.id,
    name: product.name,
    saleDate: extractDateOnly(product.saleDate),
    purchasePrice: product.purchasePrice,
    unitPrice: product.unitPrice,
    quantity: product.quantity,
    subtotal: product.subtotal,
    profit: product.profit,
    url: product.url ?? undefined,
    note: product.note ?? undefined,
  };
}

// Adds recomputed totals to the patch when unitPrice/purchasePrice/quantity
// changed; otherwise returns the incoming changes as-is.
export function buildProductDraftPatch(
  current: ProductDraftData | undefined,
  changes: Partial<ProductDraftData>,
): Partial<ProductDraftData> {
  const patch = { ...changes };

  const shouldRecalculate =
    "unitPrice" in changes ||
    "purchasePrice" in changes ||
    "quantity" in changes;

  if (!shouldRecalculate || !current) return patch;

  const merged = { ...current, ...patch };
  const { storedTotals } = calculateProductTotals(
    merged.unitPrice,
    merged.purchasePrice,
    merged.quantity,
  );

  return { ...patch, ...storedTotals };
}

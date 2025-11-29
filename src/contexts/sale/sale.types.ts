import { Prisma } from "@/generated/prisma/client";

export type SaleWithRelations = Prisma.SaleGetPayload<{
  include: { customer: true };
}>;

export interface SaleContextType {
  sales: SaleWithRelations[];
  sale: SaleWithRelations | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getSales: () => Promise<void>;
  getSale: (saleId: string, forceRefresh?: boolean) => Promise<void>;
}

import { Prisma, Product } from "@/generated/prisma/client";
import { ActionResult } from "@/lib/types";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";
import {
  CreateSaleInput,
  UpdateSaleInput,
} from "@/lib/validations/sale.schema";

export type SaleWithRelations = Prisma.SaleGetPayload<{
  include: { customer: true; products: true };
}>;

export interface SaleContextType {
  sales: SaleWithRelations[];
  sale: SaleWithRelations | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getSales: () => Promise<void>;
  getSale: (saleId: string, forceRefresh?: boolean) => Promise<void>;
  createSale: (
    data: CreateSaleInput,
  ) => Promise<ActionResult<SaleWithRelations>>;
  updateSale: (
    saleId: string,
    data: UpdateSaleInput,
  ) => Promise<ActionResult<SaleWithRelations>>;
  deleteSale: (saleId: string) => Promise<ActionResult>;
  addProduct: (data: CreateProductInput) => Promise<ActionResult<Product>>;
  updateProduct: (
    productId: string,
    data: UpdateProductInput,
  ) => Promise<ActionResult<Product>>;
  deleteProduct: (productId: string) => Promise<ActionResult>;
}

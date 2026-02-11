import { Prisma, Product } from "@/generated/prisma/client";
import {
  CreateProductData,
  UpdateProductData,
} from "@/lib/validations/product.schema";
import { CreateSaleData, UpdateSaleData } from "@/lib/validations/sale.schema";

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
  createSale: (data: CreateSaleData) => Promise<SaleWithRelations | null>;
  updateSale: (
    saleId: string,
    data: UpdateSaleData,
  ) => Promise<SaleWithRelations | null>;
  deleteSale: (saleId: string) => Promise<boolean>;
  addProduct: (data: CreateProductData) => Promise<Product | null>;
  updateProduct: (productId: string,data: UpdateProductData) => Promise<Product | null>;
}

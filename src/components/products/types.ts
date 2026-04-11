import { Product } from "@/generated/prisma/client";
import { SaleProductData } from "@/lib/validations/sale.schema";

export type ProductOrDraft = Product | SaleProductData;

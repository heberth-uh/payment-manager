import { Product } from "@/generated/prisma/client";
import { ProductDraftData } from "@/lib/validations/product.schema";

export type ProductOrDraft = Product | ProductDraftData;

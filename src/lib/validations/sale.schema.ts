import { z } from "zod";
import { ProductFormSchema } from "./product.schema";

// TODO: Relocate this schema to product.schema. Use a better name: ProductDraftSchema
const SaleProductSchema = ProductFormSchema.extend({
  id: z.string(),
  subtotal: z.number().default(0),
  profit: z.number().default(0),
});

export const CreateSaleSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED"]).default("PENDING").optional(),
  lastSaleDate: z.date().optional(),
  lastPaymentDate: z.date().optional(),
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .trim()
    .optional(),
  customerId: z.string().min(1, "El cliente es requerido"),
  products: z.array(SaleProductSchema).default([]),
});

export const UpdateSaleSchema = CreateSaleSchema.partial();

// TODO: Rename to ProductDraftData and move to product.schema
export type SaleProductData = z.infer<typeof SaleProductSchema>; 
export type CreateSaleData = z.input<typeof CreateSaleSchema>;
export type UpdateSaleData = z.input<typeof UpdateSaleSchema>;

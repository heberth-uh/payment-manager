import { z } from "zod";
import { ProductDraftSchema } from "./product.schema";

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
  products: z.array(ProductDraftSchema).default([]),
});

export const UpdateSaleSchema = CreateSaleSchema.partial();

export type CreateSaleData = z.input<typeof CreateSaleSchema>;
export type UpdateSaleData = z.input<typeof UpdateSaleSchema>;

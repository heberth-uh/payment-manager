import { z } from "zod";
import { ProductDraftSchema } from "./product.schema";

export const SaleFormSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED"]).default("PENDING").optional(),
  lastSaleDate: z.date().optional(),
  lastPaymentDate: z.date().optional(),
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .trim()
    .optional(),
  customerId: z.string().min(1, "El cliente es requerido"),
  products: z.array(ProductDraftSchema).default([]), // Only consumed during sale creation; ignored on update
});

// Server Schemas (will hold transforms)
export const CreateSaleSchema = SaleFormSchema.extend({});
export const UpdateSaleSchema = CreateSaleSchema.partial();

// Pre-parse (fetch calls)
export type CreateSaleInput = z.input<typeof CreateSaleSchema>;
export type UpdateSaleInput = z.input<typeof UpdateSaleSchema>;

// Post-parse (route handlers)
export type CreateSaleData = z.output<typeof CreateSaleSchema>;
export type UpdateSaleData = z.output<typeof UpdateSaleSchema>;

// RHF useForm
export type SaleFormData = z.infer<typeof SaleFormSchema>;

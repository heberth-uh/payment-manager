import { z } from "zod";

export const CreateSaleSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED"]).default("PENDING").optional(),
  lastSaleDate: z.coerce.date().optional(),
  lastPaymentDate: z.coerce.date().nullable().optional(),
  notes: z
    .string("")
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .trim()
    .optional(),
  customerId: z.string("El cliente es requerido"),
});

export const UpdateSaleSchema = CreateSaleSchema.partial();

export type CreateSaleData = z.infer<typeof CreateSaleSchema>;
export type UpdateCustomerData = z.infer<typeof UpdateSaleSchema>;

import { z } from "zod";
import {
  ProductDraftSchema,
  SaleProductUpdateSchema,
  SaleProductCreateSchema,
} from "./product.schema";

// API - Product Changes
export const ProductChangesSchema = z.object({
  create: z.array(SaleProductCreateSchema).default([]),
  update: z.array(SaleProductUpdateSchema).default([]),
  deleteIds: z.array(z.string()).default([]),
});

// UI - Form
export const SaleFormSchema = z.object({
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .trim()
    .optional(),
  customerId: z.string().min(1, "El cliente es requerido"),
  products: z.array(ProductDraftSchema).default([]),
});

// API - Create
export const CreateSaleSchema = z.object({
  customerId: z.string().min(1, "El cliente es requerido"),
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .trim()
    .optional(),
  products: z.array(SaleProductCreateSchema).default([]),
});

// API - Update
export const UpdateSaleSchema = z.object({
  customerId: z.string().min(1).optional(),
  notes: z.string().max(500).trim().optional(),
  status: z.enum(["PENDING", "PAID", "CANCELED"]).optional(),
  products: ProductChangesSchema.optional(),
});

// RHF useForm
export type SaleFormData = z.infer<typeof SaleFormSchema>;

// API - Create
export type CreateSaleInput = z.input<typeof CreateSaleSchema>;
export type CreateSaleData = z.output<typeof CreateSaleSchema>;

// API - Update
export type UpdateSaleInput = z.input<typeof UpdateSaleSchema>;
export type UpdateSaleData = z.output<typeof UpdateSaleSchema>;

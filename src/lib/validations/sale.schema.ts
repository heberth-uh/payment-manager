import { z } from "zod";
import {
  CreateProductSchema,
  ProductDraftSchema,
  ProductPatchSchema,
} from "./product.schema";

// API - Product Changes
export const ProductChangesSchema = z.object({
  create: z.array(CreateProductSchema).default([]),
  update: z.array(ProductPatchSchema).default([]),
  deleteIds: z.array(z.string()).default([]),
});

// UI - Form
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
  products: z.array(ProductDraftSchema).default([]),
});

// API - Create
export const CreateSaleSchema = SaleFormSchema;

// API - Update
export const UpdateSaleSchema = z.object({
  customerId: z.string().min(1).optional(),
  notes: z.string().max(500).trim().optional(),
  status: z.enum(["PENDING", "PAID", "CANCELED"]).optional(),
  products: ProductChangesSchema.optional(),
  lastSaleDate: z.date().optional(),
});

// RHF useForm
export type SaleFormData = z.infer<typeof SaleFormSchema>;

// API - Create
export type CreateSaleInput = z.input<typeof CreateSaleSchema>;
export type CreateSaleData = z.output<typeof CreateSaleSchema>;

// API - Update
export type UpdateSaleInput = z.input<typeof UpdateSaleSchema>;
export type UpdateSaleData = z.output<typeof UpdateSaleSchema>;

import { z } from "zod";

const saleDateSchema = z
  .string()
  .min(1, "La fecha es requerida")
  .refine((val) => {
    const year = new Date(val).getFullYear();
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 10 && year <= currentYear;
  }, `La fecha debe estar entre los últimos 10 años y el año actual`);

// No transforms
export const ProductFormSchema = z.object({
  name: z
    .string("El nombre es requerido")
    .trim()
    .nonempty("El nombre es requerido")
    .min(5, "El nombre del producto debe tener al menos 5 caracteres")
    .max(400, "El nombre es demasiado largo"),
  url: z.url("URL inválida").optional().or(z.literal("")),
  note: z.string("").trim().max(500, "Máximo 500 caracteres").optional(),
  saleDate: saleDateSchema,
  purchasePrice: z.coerce
    .number("El precio de compra es requerido")
    .positive("El precio de compra debe ser mayor a 0"),
  unitPrice: z.coerce
    .number("El precio de venta es requerido")
    .positive("El precio de venta debe ser mayor a 0"),
  quantity: z.coerce
    .number("La cantidad es requerida")
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

export const ProductDraftSchema = ProductFormSchema.extend({
  id: z.string(),
  subtotal: z.number().default(0),
  profit: z.number().default(0),
});

// With transforms
export const CreateProductSchema = ProductFormSchema.extend({
  saleDate: saleDateSchema.transform(val => new Date(val)),
  saleId: z.string().min(1, "La venta es requerida"),
});
export const UpdateProductSchema = CreateProductSchema.partial();

// Post-parse (route handlers)
export type CreateProductData = z.output<typeof CreateProductSchema>;
export type UpdateProductData = z.output<typeof UpdateProductSchema>;

// Pre-parse (fetch calls)
export type CreateProductInput = z.input<typeof CreateProductSchema>;
export type UpdateProductInput = z.input<typeof UpdateProductSchema>;

// ProductDraftContext
export type ProductDraftData = z.infer<typeof ProductDraftSchema>;

// RHF useForm
export type ProductFormData = z.infer<typeof ProductFormSchema>;

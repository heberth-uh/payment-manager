import { z } from "zod";

const saleDateSchema = z
  .string()
  .min(1, "La fecha es requerida")
  .refine((val) => {
    const year = new Date(val).getFullYear();
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 10 && year <= currentYear;
  }, `La fecha debe estar entre los últimos 10 años y el año actual`);

// Client schemas
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

// Server schemas
export const CreateProductSchema = ProductFormSchema.extend({
  saleDate: saleDateSchema.transform(val => new Date(val)),
  saleId: z.string().min(1, "La venta es requerida"),
});
export const UpdateProductSchema = CreateProductSchema.partial();

// Server types
export type CreateProductData = z.output<typeof CreateProductSchema>;
export type UpdateProductData = z.output<typeof UpdateProductSchema>;

// Client types
export type CreateProductInput = z.input<typeof CreateProductSchema>;
export type UpdateProductInput = z.input<typeof UpdateProductSchema>;
/* VERIFY:
 * infer is the proper utility type here? or should we use input, since it's used in a function hook and not in a form
 * Ask if we need a prefix like Create... and also, since we use partial<>,
 * ask if we need to define a separate type for the update hook draft function, if so
 * ask the conventional name since this is not nor a form input nor an output form
 */
export type ProductDraftData = z.infer<typeof ProductDraftSchema>; 

// Form types
// VERIFY: Ask if for this type, z.output is right, and understand why
export type ProductFormData = z.output<typeof ProductFormSchema>;

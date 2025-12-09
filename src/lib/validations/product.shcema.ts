import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z
    .string("El nombre es requerido")
    .trim()
    .min(5, "El nombre del producto debe tener al menos 5 caracteres")
    .max(400, "El nombre es demasiado largo"),
  url: z.url().optional(),
  note: z
    .string("")
    .max(500, "Agregue un comentario de máximo 500 caracteres")
    .trim()
    .optional(),
  saleDate: z.coerce.date(),
  purchasePrice: z
    .number("El precio de compra es requerido")
    .positive("El precio de compra debe ser mayor a 0"),
  unitPrice: z
    .number("El precio de venta es requerido")
    .positive("El precio de venta debe ser mayor a 0"),
  quantity: z
    .number("La cantidad es requerida")
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .default(1),
  saleId: z.string().min(1, "La venta es requerida"),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;

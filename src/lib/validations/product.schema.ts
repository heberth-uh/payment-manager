import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z
    .string("El nombre es requerido")
    .trim()
    .nonempty("El nombre es requerido")
    .min(5, "El nombre del producto debe tener al menos 5 caracteres")
    .max(400, "El nombre es demasiado largo"),
  url: z.url("URL inválida").optional().or(z.literal("")),
  note: z.string("").trim().max(500, "Máximo 500 caracteres").optional(),
  saleDate: z.string().min(1, "La fecha es requerida"),
  purchasePrice: z.coerce
    .number("El precio de compra es requerido")
    .positive("El precio de compra debe ser mayor a 0"),
  unitPrice: z.coerce
    .number("El precio de venta es requerido")
    .positive("El precio de venta debe ser mayor a 0"),
  quantity: z.coerce
    .number("La cantidad es requerida")
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .default(1),
  saleId: z.string().min(1, "La venta es requerida"),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;

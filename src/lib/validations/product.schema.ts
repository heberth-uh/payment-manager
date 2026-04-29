import { z } from "zod";
// FIXME: This method creates the base schema for server, so there will be fields
// that we don't need in the forms, such as saleId. In this case is better to create the base
// ONLY for the form, where we define only those fields that we will need there.
// For those fields that are required in the server but not in the form, we can set them in an
// extended new schema based on the current form schema. This way we can keep schemas clean between
// server and client.
/*
example:
// Base: formularios (tipos simples)
export const ProductFormSchema = z.object({
  name: z.string(),
  saleDate: z.string(), // ← Without transformation, because it's only for the form
  // ... otros campos
});

// Servidor: extiende con transformaciones
export const CreateProductSchema = ProductFormSchema.extend({
  saleDate: z.string().transform(val => new Date(val)), // ← Here we transform the date string to a Date, which is what the server needs.
  saleId: z.string(),
});

TODO: Do the same for the the sale schema and TEST all the CRUD from the form to the server
*/
export const CreateProductSchema = z.object({
  name: z
    .string("El nombre es requerido")
    .trim()
    .nonempty("El nombre es requerido")
    .min(5, "El nombre del producto debe tener al menos 5 caracteres")
    .max(400, "El nombre es demasiado largo"),
  url: z.url("URL inválida").optional().or(z.literal("")),
  note: z.string("").trim().max(500, "Máximo 500 caracteres").optional(),
  saleDate: z.string().min(1, "La fecha es requerida"), // TODO: It needs a validation to prevent invalid dates such as "31-03-123456"
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
  saleId: z.string().min(1, "La venta es requerida")
});

export const UpdateProductSchema = CreateProductSchema.partial();
// Form schemas 
export const ProductFormSchema = CreateProductSchema.omit({ saleId: true});

export type CreateProductData = z.output<typeof CreateProductSchema>;
export type UpdateProductData = z.output<typeof UpdateProductSchema>;

// Forms types
export type ProductFormData = z.output<typeof ProductFormSchema>;

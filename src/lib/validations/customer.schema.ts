import { z } from "zod";

export const CreateCustomerSchema = z.object({
  name: z
    .string("El nombre es requerido")
    .trim()
    .nonempty("El nombre no puede estar vacío")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: z.string().optional(),
  phone: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d{10}$/.test(val), {
      message: "El teléfono debe tener 10 dígitos",
    })
    .optional(),
  address: z.string().optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type CreateCustomerData = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerData = z.infer<typeof UpdateCustomerSchema>;

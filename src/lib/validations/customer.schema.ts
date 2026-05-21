import { z } from "zod";

export const CustomerFormSchema = z.object({
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

// Server Schemas (will hold transforms)
export const CreateCustomerSchema = CustomerFormSchema.extend({});
export const UpdateCustomerSchema = CreateCustomerSchema.partial();

// Pre-parse (fetch calls)
export type CreateCustomerInput = z.input<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.input<typeof UpdateCustomerSchema>;

// Post-parse (route handlers)
export type CreateCustomerData = z.output<typeof CreateCustomerSchema>;
export type UpdateCustomerData = z.output<typeof UpdateCustomerSchema>;

// RHF useForm
export type CustomerFormData = z.infer<typeof CustomerFormSchema>;

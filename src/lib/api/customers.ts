import { Customer } from "@prisma/client";
import {
  CreateCustomerData,
  UpdateCustomerData,
} from "@/lib/validations/customer.schema";

export const customersApi = {
  // GET ALL
  async getAll(): Promise<Customer[]> {
    const response = await fetch("/api/customers");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener clientes");
    }
    const result = await response.json();
    return result.data;
  },

  // GET BY ID
  async getById(customerId: string): Promise<Customer> {
    const response = await fetch(`/api/customers/${customerId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener cliente");
    }
    const result = await response.json();
    return result.data;
  },

  // CREATE
  async create(data: CreateCustomerData): Promise<Customer> {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener cliente");
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(
    customerId: string,
    data: UpdateCustomerData
  ): Promise<Customer> {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar cliente");
    }
    const result = await response.json();
    return result.data;
  },

  // DELETE
  async delete(customerId: string): Promise<boolean> {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar cliente");
    }
    return true;
  },
};

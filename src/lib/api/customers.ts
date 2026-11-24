import { Customer } from "@/generated/prisma/client";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/lib/validations/customer.schema";
import { extractErrorMessage } from "../utils/client-error";

export type GetCustomersParams = {
  search?: string;
  limit?: number;
  archived?: boolean;
};

export const customersApi = {
  // GET ALL
  async getAll({
    search,
    limit,
    archived,
  }: GetCustomersParams = {}): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (limit) params.set("limit", limit.toString());
    if (archived) params.set("archived", archived.toString());

    const url = `/api/customers?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al obtener clientes",
      );
      throw new Error(message);
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
  async create(data: CreateCustomerInput): Promise<Customer> {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear cliente");
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(
    customerId: string,
    data: UpdateCustomerInput,
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

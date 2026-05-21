import { SaleWithRelations } from "@/contexts/sale/sale.types";
import {
  CreateSaleInput,
  UpdateSaleInput,
} from "@/lib/validations/sale.schema";
import { extractErrorMessage } from "@/lib/utils/client-error";

export const salesApi = {
  // GET ALL
  async getAll(): Promise<SaleWithRelations[]> {
    const response = await fetch("/api/sales");
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al obtener ventas",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // GET BY ID
  async getById(saleId: string): Promise<SaleWithRelations> {
    const response = await fetch(`/api/sales/${saleId}`);
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al obtener venta",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // CREATE
  async create(data: CreateSaleInput): Promise<SaleWithRelations> {
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al crear venta",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(
    saleId: string,
    data: UpdateSaleInput,
  ): Promise<SaleWithRelations> {
    const response = await fetch(`/api/sales/${saleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al actualizar venta",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // DELETE
  async delete(saleId: string): Promise<boolean> {
    const response = await fetch(`/api/sales/${saleId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al eliminar venta",
      );
      throw new Error(message);
    }
    return true;
  },
};

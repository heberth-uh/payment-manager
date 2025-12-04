import { SaleWithRelations } from "@/contexts/sale/sale.types";
import { CreateSaleData, UpdateSaleData } from "../validations/sale.schema";

export const salesApi = {
  // GET ALL
  async getAll(): Promise<SaleWithRelations[]> {
    const response = await fetch("/api/sales");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener ventas");
    }
    const result = await response.json();
    return result.data;
  },

  // GET BY ID
  async getById(saleId: string): Promise<SaleWithRelations> {
    const response = await fetch(`/api/sales/${saleId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener venta");
    }
    const result = await response.json();
    return result.data;
  },

  // CREATE
  async create(data: CreateSaleData): Promise<SaleWithRelations> {
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear venta");
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(
    saleId: string,
    data: UpdateSaleData
  ): Promise<SaleWithRelations> {
    const response = await fetch(`/api/sales/${saleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.meessage || "Error al actualizar venta");
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
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar venta");
    }
    return true;
  },
};

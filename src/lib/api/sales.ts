import { Sale } from "@prisma/client";

export const salesApi = {
  // GET ALL
  async getAll(): Promise<Sale[]> {
    const response = await fetch("api/sales");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener ventas");
    }
    const result = await response.json();
    return result.data;
  },
};

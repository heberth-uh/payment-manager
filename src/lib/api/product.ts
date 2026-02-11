import { Product } from "@/generated/prisma/client";
import {
  CreateProductData,
  UpdateProductData,
} from "../validations/product.schema";

export const productsApi = {
  // CREATE
  async create(data: CreateProductData): Promise<Product> {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear producto");
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(productId: string, data: UpdateProductData): Promise<Product> {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar producto");
    }
    const result = await response.json();
    return result.data;
  },
};

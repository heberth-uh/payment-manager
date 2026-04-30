import { Product } from "@/generated/prisma/client";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";
import { extractErrorMessage } from "@/lib/utils/client-error";

export const productsApi = {
  // CREATE
  async create(data: CreateProductInput): Promise<Product> {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al crear producto",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // UPDATE
  async update(productId: string, data: UpdateProductInput): Promise<Product> {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al actualizarproducto",
      );
      throw new Error(message);
    }
    const result = await response.json();
    return result.data;
  },

  // DELETE
  async delete(productId: string): Promise<boolean> {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        "Error al eliminar producto",
      );
      throw new Error(message);
    }
    return true;
  },
};

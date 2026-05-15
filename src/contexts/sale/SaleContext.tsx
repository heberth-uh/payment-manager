"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { handleClientError } from "@/lib/utils/client-error";
import { salesApi } from "@/lib/api/sales";
import { SaleContextType, SaleWithRelations } from "./sale.types";
import { CreateSaleData, UpdateSaleData } from "@/lib/validations/sale.schema";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/generated/prisma/client";
import { ActionResult } from "@/lib/types";

const SaleContext = createContext<SaleContextType | null>(null);

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<SaleWithRelations[]>([]);
  const [sale, setSale] = useState<SaleWithRelations | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  const getSales = useCallback(async () => {
    setError(null);
    setIsFetching(true);

    try {
      const data = await salesApi.getAll();
      setSales(data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setIsFetching(false);
    }
  }, []);

  // GET BY ID
  const getSale = useCallback(
    async (saleId: string, forceRefresh?: boolean) => {
      if (!saleId) return;

      if (!forceRefresh && sale?.id === saleId) return;
      setError(null);
      setIsFetching(true);

      try {
        const data = await salesApi.getById(saleId);
        setSale(data);
      } catch (error) {
        setError(handleClientError(error));
      } finally {
        setIsFetching(false);
      }
    },
    [sale?.id],
  );

  // CREATE
  const createSale = useCallback(
    async (data: CreateSaleData): Promise<ActionResult<SaleWithRelations>> => {
      setError(null);
      setIsSubmitting(true);

      try {
        const newSale = await salesApi.create(data);
        setSale(newSale);
        setSales((prev) => [newSale, ...prev]);
        return { success: true, data: newSale };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // UPDATE
  const updateSale = useCallback(
    async (
      saleId: string,
      data: UpdateSaleData,
    ): Promise<ActionResult<SaleWithRelations>> => {
      setError(null);
      setIsSubmitting(true);

      try {
        const updatedSale = await salesApi.update(saleId, data);
        setSale(updatedSale);
        setSales((prev) =>
          prev.map((s) => (s.id === saleId ? updatedSale : s)),
        );
        return { success: true, data: updatedSale };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // DELETE
  const deleteSale = useCallback(
    async (saleId: string): Promise<ActionResult> => {
      setError(null);
      setIsSubmitting(true);
      try {
        await salesApi.delete(saleId);
        setSales((prev) => prev.filter((s) => s.id !== saleId));
        return { success: true };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // -----------------------
  // PRODUCT MANAGEMENT
  // -----------------------

  // ADD A PRODUCT TO A SALE
  const addProduct = useCallback(
    async (data: CreateProductInput): Promise<ActionResult<Product>> => {
      setError(null);
      setIsSubmitting(true);
      try {
        const newProduct = await productsApi.create(data);

        setSale((prev) =>
          prev && prev.id === data.saleId
            ? { ...prev, products: [...(prev.products || []), newProduct] }
            : prev,
        );
        return { success: true, data: newProduct };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // UPDATE A PRODUCT IN A SALE
  const updateProduct = useCallback(
    async (
      productId: string,
      data: UpdateProductInput,
    ): Promise<ActionResult<Product>> => {
      setError(null);
      setIsSubmitting(true);
      try {
        const updatedProduct = await productsApi.update(productId, data);
        setSale((prev) =>
          prev && prev.products?.some((p) => p.id === productId)
            ? {
                ...prev,
                products:
                  prev.products?.map((p) =>
                    p.id === productId ? updatedProduct : p,
                  ) || [],
              }
            : prev,
        );
        return { success: true, data: updatedProduct };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // REMOVE A PRODUCT FROM A SALE
  const deleteProduct = useCallback(
    async (productId: string): Promise<ActionResult> => {
      setError(null);
      setIsSubmitting(true);
      try {
        const success = await productsApi.delete(productId);
        if (success) {
          setSale((prev) =>
            prev
              ? {
                  ...prev,
                  products:
                    prev.products?.filter((p) => p.id !== productId) || [],
                }
              : prev,
          );
        }
        return { success: true };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return (
    <SaleContext.Provider
      value={{
        sales,
        sale,
        isFetching,
        isSubmitting,
        error,
        getSales,
        getSale,
        createSale,
        updateSale,
        deleteSale,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}

export const useSales = () => {
  const context = useContext(SaleContext);
  if (!context) {
    throw new Error("useSale must be used within a SaleProvider");
  }
  return context;
};

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { handleClientError } from "@/lib/utils/client-error";
import { salesApi } from "@/lib/api/sales";
import { SaleContextType, SaleWithRelations } from "./sale.types";
import { CreateSaleData, UpdateSaleData } from "@/lib/validations/sale.schema";
import {
  CreateProductData,
  UpdateProductData,
} from "@/lib/validations/product.schema";
import { productsApi } from "@/lib/api/product";
import { Product } from "@/generated/prisma/client";

const SaleContext = createContext<SaleContextType | null>(null);

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<SaleWithRelations[]>([]);
  const [sale, setSale] = useState<SaleWithRelations | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  const getSales = async () => {
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
  };

  // GET BY ID
  const getSale = async (saleId: string, forceRefresh?: boolean) => {
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
  };

  // CREATE
  const createSale = async (
    data: CreateSaleData,
  ): Promise<SaleWithRelations | null> => {
    setError(null);
    setIsSubmitting(true);

    try {
      const newSale = await salesApi.create(data);
      setSale(newSale);
      setSales((prev) => [newSale, ...prev]);
      return newSale;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE
  const updateSale = async (
    saleId: string,
    data: UpdateSaleData,
  ): Promise<SaleWithRelations | null> => {
    setError(null);
    setIsSubmitting(true);

    try {
      const updatedSale = await salesApi.update(saleId, data);
      setSale(updatedSale);
      setSales((prev) => prev.map((s) => (s.id === saleId ? updatedSale : s)));
      return updatedSale;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const deleteSale = async (saleId: string): Promise<boolean> => {
    setError(null);
    setIsSubmitting(true);
    try {
      await salesApi.delete(saleId);
      setSales((prev) => prev.filter((s) => s.id !== saleId));
      return true;
    } catch (error) {
      setError(handleClientError(error));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------
  // PRODUCT MANAGEMENT
  // -----------------------

  // ADD A PRODUCT TO A SALE
  const addProduct = async (
    data: CreateProductData,
  ): Promise<Product | null> => {
    setError(null);
    setIsSubmitting(true);
    try {
      const newProduct = await productsApi.create(data);

      if (sale && sale.id === data.saleId) {
        setSale({
          ...sale,
          products: [...(sale.products || []), newProduct],
        });
      }
      return newProduct;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE A PRODUCT IN A SALE
  const updateProduct = async (
    productId: string,
    data: UpdateProductData,
  ): Promise<Product | null> => {
    setError(null);
    setIsSubmitting(true);
    try {
      const updatedProduct = await productsApi.update(productId, data);
      if (sale && sale.products?.some((p) => p.id === productId)) {
        setSale({
          ...sale,
          products:
            sale.products?.map((p) =>
              p.id === productId ? updatedProduct : p,
            ) || [],
        });
      }
      return updatedProduct;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // REMOVE A PRODUCT FROM A SALE

  // Auto fetch sales on mount
  useEffect(() => {
    getSales();
  }, []);

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

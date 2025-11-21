"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { handleClientError } from "@/lib/utils/client-error";
import { salesApi } from "@/lib/api/sales";
import { SaleContextType, SaleWithRelations } from "./sale.types";

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
  // UPDATE
  // DELETE

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

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sale } from "@prisma/client";
import { handleClientError } from "@/lib/utils/client-error";
import { salesApi } from "@/lib/api/sales";

interface SaleContextType {
  sales: Sale[];
  sale: Sale | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getSales: () => Promise<void>;
}

const SaleContext = createContext<SaleContextType | null>(null);

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [sale, setSale] = useState<Sale | null>(null);
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

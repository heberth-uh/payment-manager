"use client";

import { createContext, useContext, useState } from "react";
import { Sale } from "@prisma/client";

interface SaleContextType {}

const SaleContext = createContext<SaleContextType | null>(null);

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [sale, setSale] = useState<Sale | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  // GET BY ID
  // CREATE
  // UPDATE
  // DELETE

  return (
    <SaleContext.Provider
      value={{ sales, sale, isFetching, isSubmitting, error }}
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
};

"use client";

import { handleClientError } from "@/lib/utils/client-error";
import { Customer } from "@prisma/client";
import { useEffect, useState } from "react";

export const useCustomers = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCustomers = async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      // TODO: Add search to the request later

      const response = await fetch("/api/customers");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener clientes");
      }
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return { data, error, loading, refetch: getCustomers };
};

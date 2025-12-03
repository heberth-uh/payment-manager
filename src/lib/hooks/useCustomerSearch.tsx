import { Customer } from "@/generated/prisma/client";
import { useState } from "react";
import { handleClientError } from "../utils/client-error";
import { customersApi } from "../api/customers";

interface UseCustomerSearchReturn {
  customers: Customer[];
  isFetching: boolean;
  error: string | null;
  searchCustomers: (search?: string, limit?: number) => Promise<void>;
}

export function useCustomerSearch(): UseCustomerSearchReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCustomers = async (search?: string, limit?: number) => {
    setError(null);
    setIsFetching(true);

    try {
      const data = await customersApi.getAll(search, limit);
      setCustomers(data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setIsFetching(false);
    }
  };

  return {
    customers,
    isFetching,
    error,
    searchCustomers,
  };
}

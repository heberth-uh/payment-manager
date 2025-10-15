"use client";

import { handleClientError } from "@/lib/utils/client-error";
import { Customer } from "@prisma/client";
import { useEffect, useState } from "react";
import { UseCustomersParmas, UseCustomersReturn } from "./customers.types";

export const useCustomers = (options: UseCustomersParmas = {}): UseCustomersReturn => {
  const { autoFetch = false, customerId } = options;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // GET ALL
  const getCustomers = async () => {
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
      setCustomers(result.data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setLoading(false);
    }
  };

  // GET BY ID
  const getCustomer = async (customerId: string) => {
    if (!customerId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener cliente");
      }
      const result = await response.json();
      setCustomer(result.data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch customers on mount
  useEffect(() => {
    if (autoFetch) {
      getCustomers();
    }
  }, [autoFetch]);

  // Auto-fetch customer details on mount
  useEffect(() => {
    if (customerId) {
      getCustomer(customerId);
    }
  }, [customerId]);

  return { customers, customer, loading, error, getCustomers, getCustomer };
};

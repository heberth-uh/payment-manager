"use client";

import { handleClientError } from "@/lib/utils/client-error";
import { Customer } from "@prisma/client";
import { useEffect, useState } from "react";
import { UseCustomersParmas, UseCustomersReturn } from "./customers.types";
import {
  CreateCustomerData,
  UpdateCustomerData,
} from "@/lib/validations/customer.schema";

export const useCustomers = (
  options: UseCustomersParmas = {}
): UseCustomersReturn => {
  const { autoFetch = false, customerId } = options;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(autoFetch);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // GET ALL
  const getCustomers = async () => {
    setIsFetching(true);
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
      setIsFetching(false);
    }
  };

  // GET BY ID
  const getCustomer = async (customerId: string) => {
    if (!customerId) return;
    setIsFetching(true);
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
      setIsFetching(false);
    }
  };

  // CREATE
  const createCustomer = async (
    data: CreateCustomerData
  ): Promise<Customer | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener cliente");
      }

      const result = await response.json();
      const newCustomer: Customer = result.data;
      return newCustomer;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE
  const updateCustomer = async (
    customerId: string,
    data: UpdateCustomerData
  ): Promise<Customer | null> => {
    if (!customerId) return null;
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar cliente");
      }

      const result = await response.json();
      const updatedCustomer: Customer = result.data;
      return updatedCustomer;
    } catch (error) {
      setError(handleClientError(error));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const deleteCustomer = async (customerId: string): Promise<boolean> => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar cliente");
      }

      // Delete from customers state
      setCustomers(customers.filter((c) => c.id !== customerId));
      // Delete from customer state
      if (customer?.id === customerId) setCustomer(null);

      return true;
    } catch (error) {
      handleClientError(error);
      return false;
    } finally {
      setIsSubmitting(false);
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

  return {
    customers,
    customer,
    isFetching,
    isSubmitting,
    error,
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

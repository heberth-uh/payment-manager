"use client";

import { customersApi } from "@/lib/api/customers";
import { handleClientError } from "@/lib/utils/client-error";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/lib/validations/customer.schema";
import { Customer } from "@/generated/prisma/client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { CustomerContextType } from "./customer.types";
import { ActionResult } from "@/lib/types";

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  const getCustomers = useCallback(async (search?: string) => {
    setError(null);
    setIsFetching(true);

    try {
      const data = await customersApi.getAll(search);
      setCustomers(data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setIsFetching(false);
    }
  }, []);

  // GET BY ID
  const getCustomer = useCallback(
    async (customerId: string, forceRefresh?: boolean) => {
      if (!customerId) return;

      if (!forceRefresh && customer?.id === customerId) return;
      setError(null);
      setIsFetching(true);

      try {
        const data = await customersApi.getById(customerId);
        setCustomer(data);
      } catch (error) {
        setError(handleClientError(error));
      } finally {
        setIsFetching(false);
      }
    },
    [customer?.id],
  );

  // CREATE
  const createCustomer = useCallback(
    async (data: CreateCustomerInput): Promise<ActionResult<Customer>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const newCustomer = await customersApi.create(data);
        setCustomer(newCustomer);
        setCustomers((prev) => [...prev, newCustomer]);
        return { success: true, data: newCustomer };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // UPDATE
  const updateCustomer = useCallback(
    async (
      customerId: string,
      data: UpdateCustomerInput,
    ): Promise<ActionResult<Customer>> => {
      if (!customerId) return { success: false, error: "Cliente no encontado" };
      setError(null);
      setIsSubmitting(true);
      try {
        const updatedCustomer = await customersApi.update(customerId, data);
        setCustomer(updatedCustomer);
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? updatedCustomer : c)),
        );
        return { success: true, data: updatedCustomer };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  // DELETE
  const deleteCustomer = useCallback(
    async (customerId: string): Promise<ActionResult> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await customersApi.delete(customerId);
        setCustomers((prev) => prev.filter((c) => c.id !== customerId));
        if (customer?.id === customerId) setCustomer(null);
        return { success: true };
      } catch (error) {
        return { success: false, error: handleClientError(error) };
      } finally {
        setIsSubmitting(false);
      }
    },
    [customer?.id],
  );

  return (
    <CustomerContext.Provider
      value={{
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
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};

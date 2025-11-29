"use client";

import { customersApi } from "@/lib/api/customers";
import { handleClientError } from "@/lib/utils/client-error";
import {
  CreateCustomerData,
  UpdateCustomerData,
} from "@/lib/validations/customer.schema";
import { Customer } from "@/generated/prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CustomerContextType } from "./customer.types";

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL
  const getCustomers = async () => {
    setError(null);
    setIsFetching(true);

    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      setError(handleClientError(error));
    } finally {
      setIsFetching(false);
    }
  };

  // GET BY ID
  const getCustomer = async (customerId: string, forceRefresh?: boolean) => {
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
  };

  // CREATE
  const createCustomer = async (
    data: CreateCustomerData
  ): Promise<Customer | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newCustomer = await customersApi.create(data);
      setCustomer(newCustomer);
      setCustomers((prev) => [...prev, newCustomer]);
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
      const updatedCustomer = await customersApi.update(customerId, data);
      setCustomer(updatedCustomer);
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? updatedCustomer : c))
      );
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
    setIsSubmitting(true);
    setError(null);

    try {
      await customersApi.delete(customerId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      if (customer?.id === customerId) setCustomer(null);
      return true;
    } catch (error) {
      setError(handleClientError(error));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto fetch customers on mount
  useEffect(() => {
    getCustomers();
  }, []);

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

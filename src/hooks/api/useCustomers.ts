"use client";

import { Customer } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export const useCustomers = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/customers");
        setData(response.data.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  return { data, error, loading };
};

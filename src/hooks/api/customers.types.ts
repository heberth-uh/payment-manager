import { Customer } from "@prisma/client";

export interface UseCustomersParmas {
  customerId?: string;
  autoFetch?: boolean;
}

export type UseCustomersReturn = {
  customers: Customer[];
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  getCustomers: () => Promise<void>;
  getCustomer: (customerId: string) => Promise<void>;
};

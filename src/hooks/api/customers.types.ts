import { CreateCustomerData } from "@/lib/validations/customer.schema";
import { Customer } from "@prisma/client";

export interface UseCustomersParmas {
  customerId?: string;
  autoFetch?: boolean;
}

export interface UseCustomersReturn {
  customers: Customer[];
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  getCustomers: () => Promise<void>;
  getCustomer: (customerId: string) => Promise<void>;
  createCustomer: (data: CreateCustomerData) => Promise<Customer | null>;
};

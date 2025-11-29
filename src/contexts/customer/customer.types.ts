import {
  CreateCustomerData,
  UpdateCustomerData,
} from "@/lib/validations/customer.schema";
import { Customer } from "@/generated/prisma/client";

export interface CustomerContextType {
  customers: Customer[];
  customer: Customer | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getCustomers: () => Promise<void>;
  getCustomer: (customerId: string, forceRefresh?: boolean) => Promise<void>;
  createCustomer: (data: CreateCustomerData) => Promise<Customer | null>;
  updateCustomer: (
    customerId: string,
    data: UpdateCustomerData
  ) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
}

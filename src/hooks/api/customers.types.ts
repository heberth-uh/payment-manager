import { CreateCustomerData, UpdateCustomerData } from "@/lib/validations/customer.schema";
import { Customer } from "@prisma/client";

export interface UseCustomersParmas {
  customerId?: string;
  autoFetch?: boolean;
}

export interface UseCustomersReturn {
  customers: Customer[];
  customer: Customer | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getCustomers: () => Promise<void>;
  getCustomer: (customerId: string) => Promise<void>;
  createCustomer: (data: CreateCustomerData) => Promise<Customer | null>;
  updateCustomer: (customerId: string, data: UpdateCustomerData) => Promise<Customer | null>;
  deleteCustomer: (custoemrId: string) => Promise<Boolean>;
};

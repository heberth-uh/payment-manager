import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/lib/validations/customer.schema";
import { ActionResult } from "@/lib/types";
import { Customer } from "@/generated/prisma/client";
import { GetCustomersParams } from "@/lib/api/customers";

export interface CustomerContextType {
  customers: Customer[];
  customer: Customer | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getCustomers: (params?: GetCustomersParams) => Promise<void>;
  getCustomer: (customerId: string, forceRefresh?: boolean) => Promise<void>;
  createCustomer: (data: CreateCustomerInput) => Promise<ActionResult<Customer>>;
  updateCustomer: (
    customerId: string,
    data: UpdateCustomerInput,
  ) => Promise<ActionResult<Customer>>;
  deleteCustomer: (customerId: string) => Promise<ActionResult>;
}

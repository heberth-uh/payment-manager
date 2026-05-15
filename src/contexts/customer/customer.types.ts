import {
  CreateCustomerData,
  UpdateCustomerData,
} from "@/lib/validations/customer.schema";
import { ActionResult } from "@/lib/types";
import { Customer } from "@/generated/prisma/client";

export interface CustomerContextType {
  customers: Customer[];
  customer: Customer | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
  getCustomers: (search?: string) => Promise<void>;
  getCustomer: (customerId: string, forceRefresh?: boolean) => Promise<void>;
  createCustomer: (data: CreateCustomerData) => Promise<ActionResult<Customer>>;
  updateCustomer: (
    customerId: string,
    data: UpdateCustomerData,
  ) => Promise<ActionResult<Customer>>;
  deleteCustomer: (customerId: string) => Promise<ActionResult>;
}

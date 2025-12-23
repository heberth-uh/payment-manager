"use client";

import React, { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import {
  CreateCustomerData,
  CreateCustomerSchema,
} from "@/lib/validations/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCustomers } from "@/contexts/customer/CustomerContext";

interface CustomerFormProps {
  isEditing?: boolean;
}

function CustomerForm({ isEditing = false }: CustomerFormProps) {
  const router = useRouter();
  const params = useParams();
  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    customer,
    isFetching,
    error,
    getCustomer,
    createCustomer,
    updateCustomer,
  } = useCustomers();

  const form = useForm<CreateCustomerData>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
      address: "",
    },
  });

  // Fetch customer data when in editing mode
  useEffect(() => {
    if (isEditing && customerId) {
      getCustomer(customerId);
    }
  }, [isEditing, customerId]);

  // Reset form with customer data when is fetched
  useEffect(() => {
    if (isEditing && customer?.id === customerId && !form.formState.isDirty) {
      form.reset({
        name: customer?.name || "",
        lastname: customer?.lastname || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
      });
    }
  }, [isEditing, customer, form]);

  const onSubmit = async (data: CreateCustomerData) => {
    if (isEditing && customerId) {
      if (!form.formState.isDirty) {
        router.push(`/customers/${customerId}`);
        return;
      }
      const result = await updateCustomer(customerId, data);
      if (result) {
        toast.success("Cliente actualizado con éxito");
        router.push(`/customers/${customerId}`);
      } else {
        toast.error(error || "Error al actualizar el cliente");
      }
    } else {
      const newCustomer = await createCustomer(data);
      if (newCustomer) {
        toast.success("Nuevo cliente agregado");
        form.reset();
        router.push(`/customers/${newCustomer.id}`);
      } else {
        toast.error(error || "Error al crear el cliente");
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="grid gap-6 mt-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nombre*"
                      {...field}
                      disabled={isFetching || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Apellido"
                      {...field}
                      disabled={isFetching || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Teléfono"
                      {...field}
                      disabled={isFetching || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Dirección"
                      {...field}
                      disabled={isFetching || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="flex-1"
              variant="secondary"
              disabled={isFetching || form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isFetching || form.formState.isSubmitting}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CustomerForm;

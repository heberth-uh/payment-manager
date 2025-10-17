"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import {
  CreateCustomerData,
  CreateCustomerSchema,
} from "@/lib/validations/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCustomers } from "@/hooks/api/useCustomers";
import { toast } from "sonner";

function CustomerForm() {
  const router = useRouter();
  const { loading, error, createCustomer } = useCustomers();
  const form = useForm<CreateCustomerData>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: CreateCustomerData) => {
    const newCustomer = await createCustomer(data);
    if (newCustomer) {
      toast.success("Nuevo cliente agregado")
      form.reset();
      router.push(`/customers/${newCustomer.id}`);
    } else {
      toast.error(error || "Error al crear el cliente")
    }
  }

  return (
    <div>
      <Form {...form}>
        <form className="grid gap-6 mt-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nombre*" {...field} />
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
                    <Input placeholder="Apellido" {...field} />
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
                    <Input placeholder="Teléfono" {...field} />
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
                    <Input placeholder="Dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Button type="button" onClick={() => router.back()} className="flex-1" variant={'secondary'}>
                Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CustomerForm;

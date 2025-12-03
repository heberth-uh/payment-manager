"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  CreateSaleData,
  CreateSaleSchema,
} from "@/lib/validations/sale.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CustomerCombobox from "../CustomerCombobox";

function SaleForm() {
  const form = useForm<CreateSaleData>({
    resolver: zodResolver(CreateSaleSchema),
    defaultValues: {
      customerId: "",
      notes: "",
    },
  });

  const onsubmit = (data: CreateSaleData) => {
    console.log("submitting test...", data);
  };

  return (
    <Form {...form}>
      <form className="grid gap-6 mt-6" onSubmit={form.handleSubmit(onsubmit)}>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente*</FormLabel>
                <FormControl>
                  <CustomerCombobox
                    onChange={field.onChange}
                    value={field.value}
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
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentarios</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Agregar una nota o comentario"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button type="button" className="flex-1" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SaleForm;

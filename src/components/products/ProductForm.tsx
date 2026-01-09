"use client";

import React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  CreateProductData,
  CreateProductSchema,
} from "@/lib/validations/product.schema";

interface ProductFormProps {
  onSuccess?: () => void;
}

// TODO: Move to utils
const todayLocalISODate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
};

function ProductForm({ onSuccess }: ProductFormProps) {
  const form = useForm<CreateProductData>({
    resolver: zodResolver(CreateProductSchema) as Resolver<CreateProductData>,
    defaultValues: {
      name: "",
      url: "",
      note: "",
      saleDate: todayLocalISODate(),
      purchasePrice: 0,
      unitPrice: 0,
      quantity: 1,
      saleId: "mir0o6r00000okv4onpondco",
    },
  });

  const unitPrice = form.watch("unitPrice") || 0;
  const purchasePrice = form.watch("purchasePrice") || 0;
  const profit = unitPrice - purchasePrice;
  const subtotal = unitPrice * (form.watch("quantity") || 1);

  const onSubmit = (data: CreateProductData) => {
    // TODO: Here goes the logic to submit the form data
    console.log("submitting", data);
    form.reset();
    onSuccess?.();
  };

  const onCancel = () => {
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 flex-1 overflow-auto px-4 pb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del producto*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de compra</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de venta</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 bg-gray-100 p-2 rounded-sm">
            <p className="text-sm font-medium">Ganancia estimada</p>
            <p
              className={`text-sm font-bold ${
                profit < 0 ? "text-destructive" : "text-primary"
              }`}
            >
              ${profit.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad*</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de venta</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 bg-gray-100 p-2 rounded-sm">
            <p className="text-sm font-medium">Subtotal</p>
            <p className="text-sm font-bold">${subtotal.toFixed(2)}</p>
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlace externo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Link de Shein/Amazon"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentarios</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Comentarios adicionales del producto"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center items-center gap-4 border-t-2 py-4 shrink-0 px-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="grow"
          >
            Cancelar
          </Button>
          <Button type="submit" className="grow">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;

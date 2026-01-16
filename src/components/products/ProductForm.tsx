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
import { getTodayLocalISODate } from "@/lib/utils/date";
import { useSales } from "@/contexts/sale/SaleContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
  onSuccess?: () => void;
}

function ProductForm({ onSuccess }: ProductFormProps) {
  const params = useParams();
  const saleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isSubmitting, addProduct } = useSales();

  const form = useForm<CreateProductData>({
    resolver: zodResolver(CreateProductSchema) as Resolver<CreateProductData>,
    defaultValues: {
      name: "",
      url: "",
      note: "",
      saleDate: getTodayLocalISODate(),
      purchasePrice: 0,
      unitPrice: 0,
      quantity: 1,
      saleId: saleId || "",
    },
  });

  const unitPrice = form.watch("unitPrice") || 0;
  const purchasePrice = form.watch("purchasePrice") || 0;
  const quantity = form.watch("quantity") || 1;
  const unitProfit = unitPrice - purchasePrice;
  const totalProfit = unitProfit * quantity;
  const subtotal = unitPrice * quantity;

  const onSubmit = async (data: CreateProductData) => {
    console.log("submitting", data);
    const newProduct = await addProduct(data);
    if (newProduct) {
      toast.success("Se agregó un producto a la venta");
      form.reset();
      onSuccess?.();
    } else {
      toast.error("No se pudo agregar el producto");
    }
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
                  <Input
                    placeholder="Nombre del producto*"
                    {...field}
                    disabled={isSubmitting || form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-6">
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
                      disabled={isSubmitting || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={isSubmitting || form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-gray-100 p-2 rounded-sm">
            <p
              className={`text-sm font-medium ${quantity < 2 ? "hidden" : ""}`}
            >
              Ganancia unitaria
            </p>
            <p
              className={`text-sm font-bold ${
                unitProfit < 0 ? "text-destructive" : "text-primary"
              } ${quantity < 2 ? "hidden" : ""}`}
            >
              ${unitProfit.toFixed(2)}
            </p>
            <p className="text-sm font-medium">Ganancia total</p>
            <p
              className={`text-sm font-bold ${
                totalProfit < 0 ? "text-destructive" : "text-primary"
              }`}
            >
              ${totalProfit.toFixed(2)}
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
                    <Input
                      type="number"
                      {...field}
                      disabled={isSubmitting || form.formState.isSubmitting}
                    />
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
                    <Input
                      type="date"
                      {...field}
                      disabled={isSubmitting || form.formState.isSubmitting}
                    />
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
                    disabled={isSubmitting || form.formState.isSubmitting}
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
                    disabled={isSubmitting || form.formState.isSubmitting}
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
          </Button> {/* TODO: Add a confirmation dialog */}
          <Button type="submit" className="grow">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;

"use client";

import React, { useEffect } from "react";
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
  ProductFormData,
  ProductFormSchema,
  CreateProductInput,
} from "@/lib/validations/product.schema";
import { extractDateOnly, getTodayLocalISODate } from "@/lib/utils/date";
import { useSales } from "@/contexts/sale/SaleContext";
import { toast } from "sonner";
import { ProductOrDraft } from "./types";
import { useProductDraft } from "@/contexts/product/ProductDraftContext";
import { getDirtyFields, handleNumberInputChange } from "@/lib/utils/form";

interface ProductFormProps {
  saleId?: string;
  isEditing?: boolean;
  product?: ProductOrDraft;
  isDraftMode?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
}

function ProductForm({
  saleId,
  isEditing,
  product,
  isDraftMode = false,
  onClose,
  onCancel,
}: ProductFormProps) {
  const { addProduct, updateProduct } = useSales();
  const { addProductDraft, updateProductDraft } = useProductDraft();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema) as Resolver<ProductFormData>,
    defaultValues: {
      name: "",
      url: "",
      note: "",
      saleDate: getTodayLocalISODate(),
      purchasePrice: 0,
      unitPrice: 0,
      quantity: 1,
    },
  });

  // Calculate profit and subtotal for real-time display
  const unitPrice = form.watch("unitPrice") || 0;
  const purchasePrice = form.watch("purchasePrice") || 0;
  const quantity = form.watch("quantity") || 1;
  const unitProfit = unitPrice - purchasePrice;
  const totalProfit = unitProfit * quantity;
  const subtotal = unitPrice * quantity;

  // Reset form with product data
  useEffect(() => {
    if (isEditing) {
      if (!product) {
        toast.error("Ocurrió un error al cargar el artículo que desea editar");
        onClose?.();
        return;
      }
      if (!form.formState.isDirty) {
        form.reset({
          name: product.name || "",
          url: product.url || "",
          note: product.note || "",
          saleDate: extractDateOnly(product.saleDate || new Date()),
          purchasePrice: product.purchasePrice || 0,
          unitPrice: product.unitPrice || 0,
          quantity: product.quantity || 1,
        });
      }
    }
  }, [isEditing, product, form, onClose]);

  const onSubmit = async (data: ProductFormData) => {
    // Edit mode: Update existing product, only send changed fields
    if (isEditing && product) {
      if (!form.formState.isDirty) {
        onClose?.();
        return;
      }
      const changedData = getDirtyFields(form, data);
      const result = await updateProduct(product.id, changedData);
      if (result.success) {
        toast.success("Producto actualizado con éxito");
        onClose?.();
      } else {
        toast.error(result.error);
      }
      // Create mode: Add new product to an existing sale
    } else {
      let result = null;
      const draftData: CreateProductInput = {
        ...data,
        saleId: saleId || "",
      };
      result = await addProduct(draftData);
      if (result.success) {
        toast.success("Se agregó un producto a la venta");
        form.reset();
        onClose?.();
      } else {
        toast.error(result.error);
      }
    }
  };

  /*
    Create/Edit product draft. This function is triggered only in draft mode
    Handles "Guardar" button by onclick to save product in the draft context
   */
  // TODO: Unify this with onSubmit to centralize the save action and just use type=button or type=submit.
  // Needs to be analyzed which one is better or keep it separated for clarity.
  const handleSave = form.handleSubmit((data) => {
    if (isEditing) {
      if (!product?.id) return;
      updateProductDraft(product.id, data);
    } else {
      addProductDraft(data);
    }
    form.reset();
    onClose?.();
  });

  const handleOnCancel = () => {
    if (!isEditing) {
      form.reset();
    }
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col h-full"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
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
                    disabled={form.formState.isSubmitting}
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
                      disabled={form.formState.isSubmitting}
                      onChange={handleNumberInputChange(field.onChange)}
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
                      disabled={form.formState.isSubmitting}
                      onChange={handleNumberInputChange(field.onChange)}
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
                      disabled={form.formState.isSubmitting}
                      onChange={handleNumberInputChange(field.onChange)}
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
                      disabled={form.formState.isSubmitting}
                      min={`${new Date().getFullYear() - 10}-01-01`}
                      max={`${new Date().getFullYear()}-12-31`}
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
                    disabled={form.formState.isSubmitting}
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
                    disabled={form.formState.isSubmitting}
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
            onClick={handleOnCancel}
            className="grow"
            disabled={form.formState.isSubmitting}
          >
            Cancelar
            {/* TODO: Add a confirmation dialog */}
          </Button>{" "}
          <Button
            type={isDraftMode ? "button" : "submit"}
            className="grow"
            onClick={isDraftMode ? handleSave : undefined}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Guardando" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;

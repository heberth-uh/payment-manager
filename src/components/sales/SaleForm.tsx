"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Resolver, useForm } from "react-hook-form";
import {
  SaleFormSchema,
  SaleFormData,
} from "@/lib/validations/sale.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CustomerCombobox from "../customers/CustomerCombobox";
import { useSales } from "@/contexts/sale/SaleContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductListSection from "../products/ProductListSection";
import { useProductDraft } from "@/contexts/product/ProductDraftContext";

interface SaleFormProps {
  saleId?: string;
  isEditing?: boolean;
}

function SaleForm({ saleId, isEditing = false }: SaleFormProps) {
  const router = useRouter();
  const { drafts } = useProductDraft();
  const { sale, isFetching, isSubmitting, getSale, createSale, updateSale } =
    useSales();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(SaleFormSchema) as Resolver<SaleFormData>,
    defaultValues: {
      customerId: "",
      notes: "",
      products: [],
    },
  });

  // Fetch sale data when in editing mode
  useEffect(() => {
    if (isEditing && saleId) {
      getSale(saleId);
    }
  }, [isEditing, saleId, getSale]);

  // Reset form with sale data when is fetched
  useEffect(() => {
    if (isEditing && sale?.id === saleId && !form.formState.isDirty) {
      form.reset({
        customerId: sale?.customerId || "",
        notes: sale?.notes || "",
      });
    }
  }, [isEditing, sale, form, saleId]);

  if (isEditing && !sale && !isFetching) {
    return <p>No se encontró la venta</p>;
  }

  const onsubmit = async (data: SaleFormData) => {
    if (isEditing && saleId) {
      if (!form.formState.isDirty) {
        router.push(`/sales/${saleId}`);
        return;
      }
      const result = await updateSale(saleId, data);
      if (result.success) {
        toast.success("Venta actualizada con éxito");
        router.push(`/sales/${saleId}`);
      } else {
        toast.error(result.error);
      }
    } else {
      const saleData = { ...data, products: drafts };
      const result = await createSale(saleData);
      if (result.success) {
        toast.success("Nueva venta creada");
        form.reset();
        router.push(`/sales/${result.data?.id}`);
      } else {
        toast.error(result.error);
      }
    }
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
                    initialCustomer={isEditing ? sale?.customer : null}
                    disabled={isFetching || isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ProductListSection
          products={!isEditing ? drafts : sale?.products || []}
          saleId={saleId}
          isDraftMode={!isEditing}
        />
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
                    disabled={isFetching || form.formState.isSubmitting}
                    className="resize-none"
                    {...field}
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
            className="flex-1"
            variant="secondary"
            onClick={() => router.back()}
          >
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

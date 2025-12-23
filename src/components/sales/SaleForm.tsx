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
import { useForm } from "react-hook-form";
import {
  CreateSaleData,
  CreateSaleSchema,
} from "@/lib/validations/sale.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CustomerCombobox from "../customers/CustomerCombobox";
import { useSales } from "@/contexts/sale/SaleContext";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

function SaleForm({ isEditing = false }: { isEditing?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const saleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    sale,
    isFetching,
    isSubmitting,
    error,
    getSale,
    createSale,
    updateSale,
  } = useSales();

  const form = useForm<CreateSaleData>({
    resolver: zodResolver(CreateSaleSchema),
    defaultValues: {
      customerId: "",
      notes: "",
    },
  });

  // Fetch sale data when in editing mode
  useEffect(() => {
    if (isEditing && saleId) {
      getSale(saleId);
    }
  }, [isEditing, saleId]);

  // Reset form with sale data when is fetched
  useEffect(() => {
    if (isEditing && sale?.id === saleId && !form.formState.isDirty) {
      form.reset({
        customerId: sale?.customerId || "",
        notes: sale?.notes || "",
      });
    }
  }, [isEditing, sale, form]);

  const onsubmit = async (data: CreateSaleData) => {
    if (isEditing && saleId) {
      if (!form.formState.isDirty) {
        router.push(`/sales/${saleId}`);
        return;
      }
      const result = await updateSale(saleId, data);
      if (result) {
        toast.success("Venta actualizada con éxito");
        router.push(`/sales/${saleId}`);
      } else {
        toast.error(error || "Error al actualizar la venta");
      }
    } else {
      const newSale = await createSale(data);
      if (newSale) {
        toast.success("Nueva venta creada");
        form.reset();
        router.push(`/sales/${newSale.id}`);
      } else {
        toast.error(error || "Error al crear el venta");
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

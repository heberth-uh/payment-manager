"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSales } from "@/contexts/sale/SaleContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import ProductListSection from "@/components/products/ProductListSection";

function SaleDetails({ id: saleId }: { id: string }) {
  const router = useRouter();
  const { sale, isFetching, error, getSale, deleteSale } = useSales();

  useEffect(() => {
    if (saleId) {
      getSale(saleId);
    }
  }, [saleId, getSale]);

  const dialogDescription = (
    <span>
      También se eliminarán todos los <b>pagos</b> asociados.
      <br />
      <br />
      ¿Estás seguro de eliminar esta venta?
      <br />
      Esta acción no se puede deshacer.
    </span>
  );

  if (!saleId) return <p>El ID de la venta es inválido</p>;

  if (error) {
    return <PageContainer>Error {error}</PageContainer>; // TODO: Create Error component
  }

  const handleDeleteSale = async (id: string) => {
    const result = await deleteSale(id);
    if (result.success) {
      toast.success("Se ha eliminado una venta");
      router.push("/sales");
    } else {
      toast.error("No se pudo eliminar la venta");
    }
  };

  return isFetching ? (
    <p>Cargando...</p>
  ) : (
    <PageContainer>
      <div className="flex justify-between items-center">
        <div>
          <Label>Cliente</Label>
          <h1 className="font-semibold text-lg mb-2">
            {`${sale?.customer?.name ?? ""}${sale?.customer?.lastname ? " " + sale.customer.lastname : ""}`}
          </h1>
        </div>
        <div>
          <Label>Estado</Label>
          <div className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 my-2 rounded-md">
            {sale?.status}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <Label>Fecha de última venta</Label>
        <p>
          {sale?.lastSaleDate
            ? new Date(sale.lastSaleDate).toLocaleString() // TODO: Create an utility function to formate dates
            : "-"}
        </p>
      </div>
      <ProductListSection products={sale?.products || []} saleId={saleId} />

      <div>
        <Label>Notas</Label>
        <p className="italic text-gray-500">{sale?.notes || "No hay notas"}</p>
      </div>

      <div className="my-6 flex justify-end items-center gap-2">
        <ConfirmDialog
          title="Eliminar venta"
          description={dialogDescription}
          confirmText="Eliminar"
          actionConfirm={() => handleDeleteSale(saleId)}
        >
          <Button type="button" variant="secondary" size="sm" title="Eliminar">
            <Trash />
          </Button>
        </ConfirmDialog>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/sales/edit/${saleId}`)}
          title="Editar"
        >
          <Pencil />
        </Button>
      </div>
    </PageContainer>
  );
}

export default SaleDetails;

"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useSales } from "@/contexts/sale/SaleContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import ConfirmaDialog from "@/components/ui/ConfirmaDialog";
import { toast } from "sonner";
import SideSheet from "@/components/ui/SideSheet";
import ProductView from "@/components/products/ProductView";

function SalePage() {
  const params = useParams();
  const saleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  if (!saleId) return <p>El ID de la venta es inválido</p>;

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
  const { sale, isFetching, error, getSale, deleteSale } = useSales();

  if (error) {
    return <PageContainer>Error {error}</PageContainer>; // TODO: Create Error component
  }

  useEffect(() => {
    getSale(saleId); // TODO: Check why it seems like it called twice
  }, [saleId]);

  const handleDeleteSale = async (id: string) => {
    const success = await deleteSale(id);
    if (success) {
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
            {`${sale?.customer.name}${" " + sale?.customer.lastname}`}
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
        <p>{sale?.lastSaleDate.toLocaleString()}</p>
      </div>

      <div className="mt-6 mb-2 border rounded-sm p-2">
        {sale?.products.length ? (
          <>
            <div className="flex justify-between items-center">
              <h3>Productos ({sale.products.length})</h3>
              <SideSheet
                title="Crear producto"
                description="Descripción opcional"
                content={(closeSheet) => <ProductView mode="create" onSuccess={closeSheet}/>}
              >
                <Button variant="default" size="sm">
                  + Nuevo
                </Button>                
              </SideSheet>
            </div>
            <div className="mt-2 space-y-2">
              {sale.products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center bg-gray-50 border rounded-sm p-2"
                >
                  <div className="w-4/5 space-y-1">
                    <p className="text-sm line-clamp-1">{product.name}</p>
                    <div className="flex justify-between items-center text-xs italic">
                      <p>{product.saleDate.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-1/5 text-right">
                    <p className="font-semibold text-sm">${product.subtotal}</p>
                    <p className="text-xs">&times;{product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>No hay productos</div>
        )}
      </div>

      <div>
        <Label>Notas</Label>
        <p className="italic text-gray-500">{sale?.notes || "No hay notas"}</p>
      </div>

      <div className="mt-6 flex justify-end items-center gap-2">
        <ConfirmaDialog
          title="Eliminar venta"
          description={dialogDescription}
          confirmText="Eliminar"
          actionConfirm={() => handleDeleteSale(saleId)}
        >
          <Button type="button" variant="secondary" size="sm" title="Eliminar">
            <Trash />
          </Button>
        </ConfirmaDialog>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/sales/edit/${sale?.id}`)}
          title="Editar"
        >
          <Pencil />
        </Button>
      </div>
    </PageContainer>
  );
}

export default SalePage;

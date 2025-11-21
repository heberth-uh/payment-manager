"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Database, MapPin, Pencil, Phone } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSales } from "@/contexts/sale/SaleContext";
import { PageContainer } from "@/components/PageContainer";

function SalePage() {
  const params = useParams();
  const router = useRouter();
  const saleId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!saleId) return <p>El ID de la venta es inválido</p>;

  const { sale, isFetching, error, getSale } = useSales();

  if (error) {
    return <PageContainer>Error {error}</PageContainer>; // TODO: Create Error component
  }

  useEffect(() => {
    getSale(saleId); // TODO: Check why it seems like it called twice
  }, [saleId]);

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
      <div>
        <Label>Notas</Label>
        <p className="italic color-gray-500">{sale?.notes || "No hay notas"}</p>
      </div>
    </PageContainer>
  );
}

export default SalePage;

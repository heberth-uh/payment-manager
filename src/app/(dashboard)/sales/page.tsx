"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useSales } from "@/contexts/sale/SaleContext";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

function SalesPage() {
  const { sales, isFetching, error, getSales } = useSales();

  if (error) {
    return <PageContainer>Error {error}</PageContainer>; // TODO: Create Error component
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Ventas</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => getSales()}
            variant="secondary"
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching && "animate-spin"}`} />
          </Button>
          <Button>
            <Link href="sales/new">Nuevo</Link>
          </Button>
        </div>
      </div>

      {isFetching && sales.length === 0 ? (
        <p>Cargando...</p>
      ) : sales.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-gray-500">No hay clientes todavía</p>
          <Button asChild className="mt-4">
            <Link href="customers/new">Crear primer cliente</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <ul className="flex flex-col gap-2">
            {sales?.map((sale) => (
              <li key={sale.id}>
                <Link
                  href={`/sales/${sale.id}`}
                  className="flex justify-between items-center"
                >
                  <p>
                    {`${sale?.customer.name}${" " + sale?.customer.lastname}`}
                  </p>
                  <p>{sale.lastSaleDate.toLocaleString()}</p>
                  <div>{sale.status}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}

export default SalesPage;

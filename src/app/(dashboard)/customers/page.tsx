"use client";

import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { useCustomers } from "@/hooks/api/useCustomers";
import { Pencil, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function CustomersPage() {
  const { customers, loading, error, getCustomers } = useCustomers({
    autoFetch: true,
  });

  if (error) {
    return <PageContainer>Error {error}</PageContainer>;
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Clientes</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => getCustomers()} variant={"secondary"}>
            <RefreshCw className="size-4" />
          </Button>
          <Button>
            <Link href={"customers/new"}>Nuevo</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="mt-4">
          <ul className="flex flex-col gap-2">
            {customers?.map((customer) => (
              <li
                key={customer.id}
                className="flex justify-between items-center"
              >
                <Link href={`/customers/${customer.id}`}>
                  {customer.name}
                  {customer.lastname && ` ${customer.lastname}`}
                </Link>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    title="Eliminar"
                  >
                    <Trash />
                  </Button>
                  <Link href={`/customers/edit/${customer.id}`}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      title="Editar"
                    >
                      <Pencil />
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}

export default CustomersPage;

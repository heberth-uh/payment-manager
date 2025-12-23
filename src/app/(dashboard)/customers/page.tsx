"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import ConfirmaDialog from "@/components/ui/ConfirmaDialog";
import { toast } from "sonner";
import { useCustomers } from "@/contexts/customer/CustomerContext";
import { Pencil, RefreshCw, Trash } from "lucide-react";

function CustomersPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    customers,
    isFetching,
    isSubmitting,
    error,
    getCustomers,
    deleteCustomer,
  } = useCustomers();

  if (error) {
    return <PageContainer>Error {error}</PageContainer>;
  }

  const handleDeleteCustomer = async (id: string) => {
    setDeletingId(id);
    const success = await deleteCustomer(id);
    setDeletingId(null);
    if (success) {
      toast.success("Se ha eliminado un cliente");
    } else {
      toast.error(error || "No se pudo eliminar el cliente");
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Clientes</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => getCustomers()}
            variant="secondary"
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching && "animate-spin"}`} />
          </Button>
          <Button>
            <Link href="customers/new">Nuevo</Link>
          </Button>
        </div>
      </div>

      {isFetching && customers.length === 0 ? (
        <p>Cargando...</p>
      ) : customers.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-gray-500">No hay clientes todavía</p>
          <Button asChild className="mt-4">
            <Link href="customers/new">Crear primer cliente</Link>
          </Button>
        </div>
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
                {deletingId === customer.id ? (
                  <div className="flex items-center gap-2">
                    <span className="italic text-gray-600">Eliminando</span>
                    <div className="size-3 rounded-full border-2 border-gray-600 border-t-transparent animate-spin [animation-duration:0.4s]"></div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <ConfirmaDialog
                      title="Eliminar cliente"
                      description={`¿Estás seguro de eliminar a ${customer.name}? Esta acción no se puede deshacer.`}
                      actionConfirm={() => handleDeleteCustomer(customer.id)}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        title="Eliminar"
                        disabled={isSubmitting}
                      >
                        <Trash />
                      </Button>
                    </ConfirmaDialog>
                    <Link href={`/customers/edit/${customer.id}`}>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        title="Editar"
                        disabled={isSubmitting}
                      >
                        <Pencil />
                      </Button>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}

export default CustomersPage;

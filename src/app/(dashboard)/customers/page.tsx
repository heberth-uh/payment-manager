"use client";

import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { useCustomers } from "@/hooks/api/useCustomers";
import { Pencil, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConfirmaDialog from "@/components/ui/ConfirmaDialog";
import { toast } from "sonner";

function CustomersPage() {
  const { customers, loading, error, getCustomers, deleteCustomer } =
    useCustomers({
      autoFetch: true,
    });

  if (error) {
    return <PageContainer>Error {error}</PageContainer>;
  }

  const handleDeleteCustomer = async (id: string) => {
    const success = await deleteCustomer(id);
    if (success) {
      toast.success("Se ha eliminado un cliente");
    } else {
      toast.error("No se pudo eliminar el cliente");
    }
  };

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

      {/* TODO: This loading state should be improved, 
      it's fine for fetching 'cause data is not yet
      but for deleting, we already have data so we don't need to show a loading state
      since the customer list is updated in the hook */}
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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { useCustomers } from "@/contexts/customer/CustomerContext";
import { Check, Pencil, RefreshCw, Trash } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { useRouter, useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";

function CustomersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const archived = searchParams.get("archived") === "true";
  const hasFilters = archived;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    customers,
    isFetching,
    isSubmitting,
    error,
    getCustomers,
    deleteCustomer,
  } = useCustomers();

  useEffect(() => {
    getCustomers({ archived });
  }, [getCustomers, archived]);

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          message={error}
          onRetry={() => getCustomers({ archived })}
        />
      </PageContainer>
    );
  }

  const handleDeleteCustomer = async (id: string) => {
    setDeletingId(id);
    const result = await deleteCustomer(id);
    setDeletingId(null);
    if (result.success) {
      toast.success("Se ha eliminado un cliente");
    } else {
      toast.error(result.error);
    }
  };

  const toggleArchive = () => {
    router.replace(archived ? "/customers" : "/customers?archived=true");
  };

  const emptyState = hasFilters ? (
    <div className="text-center p-12">
      <p className="text-gray-500">No se encontraron resultados</p>
    </div>
  ) : (
    <div className="text-center p-12">
      <p className="text-gray-500">No hay clientes todavía</p>
      <Button asChild className="mt-4">
        <Link href="/customers/new">Crear primer cliente</Link>
      </Button>
    </div>
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Clientes</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => getCustomers({ archived })}
            variant="secondary"
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching && "animate-spin"}`} />
          </Button>
          <Button asChild>
            <Link href="/customers/new">Nuevo</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center mt-2 gap-2">
        <Toggle
          variant="outline"
          size="sm"
          onPressedChange={toggleArchive}
          pressed={archived}
        >
          Solo archivados
          {archived && <Check className="size-4" />}
        </Toggle>
      </div>

      {isFetching && customers.length === 0 ? (
        <p>Cargando...</p> // TODO: use a Skeleton screen
      ) : customers.length === 0 ? (
        emptyState
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
                    <div className="size-3 rounded-full border-2 border-gray-600 border-t-transparent animate-spin animation-duration-[0.5s]"></div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <ConfirmDialog
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
                    </ConfirmDialog>
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

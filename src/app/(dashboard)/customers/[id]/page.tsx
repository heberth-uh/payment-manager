"use client";

import { Button } from "@/components/ui/button";
import ConfirmaDialog from "@/components/ui/ConfirmaDialog";
import { useCustomers } from "@/hooks/api/useCustomers";
import { MapPin, Pencil, Phone, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function CustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!customerId) return <p>El ID del cliente es inválido</p>;
  const { customer, isFetching, error, getCustomer, deleteCustomer } =
    useCustomers({
      autoFetch: true,
      customerId,
    });

  if (error) return <p>{error}</p>;

  const handleDeleteCustomer = async (id: string) => {
    const success = await deleteCustomer(id);
    if (success) {
      toast.success("Se ha eliminado un cliente");
      router.push("/customers");
    } else {
      toast.error("No se pudo eliminar el cliente");
    }
  };

  return isFetching ? (
    <p>Cargando...</p>
  ) : (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg mb-2">
          {`${customer?.name}${" " + customer?.lastname}`}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            title="Editar"
            onClick={() => getCustomer(customerId)}
          >
            <RefreshCw className="size-4" />
          </Button>
          <ConfirmaDialog
            title="Eliminar cliente"
            description={`¿Estás seguro de eliminar a ${customer?.name}? Esta acción no se puede deshacer.`}
            actionConfirm={() => handleDeleteCustomer(customerId)}
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
          <Link href={`/customers/edit/${customer?.id}`}>
            <Button type="button" variant="secondary" size="sm" title="Editar">
              <Pencil />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Phone />
        <p>{customer?.phone}</p>
      </div>
      <div className="flex items-center gap-2">
        <MapPin />
        <p>{customer?.address}</p>
      </div>
    </div>
  );
}

export default CustomerPage;

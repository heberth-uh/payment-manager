"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/contexts/customer/CustomerContext";
import { MapPin, Pencil, Phone, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CustomerDetails({ id: customerId }: { id: string }) {
  const router = useRouter();
  const { customer, isFetching, error, getCustomer, deleteCustomer } =
    useCustomers();

  useEffect(() => {
    getCustomer(customerId);
  }, [customerId, getCustomer]);

  if (!customerId) return <p>El ID del cliente es inválido</p>;
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

  const dialogDescription = (
    <span>
      ¿Estás seguro de eliminar a <b>{customer?.name}</b> de tu lista de
      clientes? Esta acción no se puede deshacer.
    </span>
  );

  return isFetching ? (
    <p>Cargando...</p>
  ) : (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Label>Nombre</Label>
          <h1 className="font-semibold text-lg mb-2">
            {`${customer?.name}${" " + customer?.lastname}`}
          </h1>
        </div>
        <div className="flex gap-2">
          <ConfirmDialog
            title="Eliminar cliente"
            description={dialogDescription}
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
          </ConfirmDialog>
          <Link href={`/customers/edit/${customer?.id}`}>
            <Button type="button" variant="secondary" size="sm" title="Editar">
              <Pencil />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Phone className="size-4" />
        <p>{customer?.phone || "Sin teléfono"}</p>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="size-4" />
        <p>{customer?.address || "Sin dirección"}</p>
      </div>
    </>
  );
}

export default CustomerDetails;

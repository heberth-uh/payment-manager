"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/contexts/customer/CustomerContext";
import {
  MapPin,
  Pencil,
  Phone,
  Trash,
  ArchiveIcon,
  ArchiveRestore,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorState } from "../ui/ErrorState";
import { Badge } from "@/components/ui/badge";

function CustomerDetails({ id: customerId }: { id: string }) {
  const router = useRouter();
  const {
    customer,
    isFetching,
    isSubmitting,
    error,
    getCustomer,
    deleteCustomer,
    updateCustomer,
  } = useCustomers();

  useEffect(() => {
    getCustomer(customerId);
  }, [customerId, getCustomer]);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => getCustomer(customerId, true)}
      />
    );
  }

  const handleDeleteCustomer = async () => {
    const result = await deleteCustomer(customerId);
    if (result.success) {
      toast.success("Se ha eliminado un cliente");
      router.push("/customers");
    } else {
      toast.error("No se pudo eliminar el cliente");
    }
  };

  const toggleArchiveCustomer = async () => {
    const result = await updateCustomer(customerId, {
      isActive: !customer?.isActive,
    });
    if (result.success) {
      const message = customer?.isActive
        ? "Se ha archivado el cliente"
        : "Se ha reactivado el cliente";
      toast.success(message);
    } else {
      toast.error(result.error);
    }
  };

  const dialogDelete = (
    <span>
      ¿Estás seguro de eliminar a <b>{customer?.name}</b> de tu lista de
      clientes? Esta acción no se puede deshacer.
    </span>
  );

  const dialogArchive = (
    <span>
      <b>{customer?.name}</b> dejará de aparecer en tu lista de clientes. Su
      historial se conserva y puedes reactivarlo cuando quieras.
    </span>
  );

  return isFetching ? (
    <p>Cargando...</p>
  ) : (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <Label>Nombre</Label>
          <h1 className="font-semibold text-lg">
            {customer?.name}
            {customer?.lastname && ` ${customer?.lastname}`}
          </h1>
        </div>
        <div className="flex gap-2">
          {customer?.isActive === false ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              title="Reactivar"
              onClick={() => toggleArchiveCustomer()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="size-3 rounded-full border-2 border-gray-600 border-t-transparent animate-spin animation-duration-[0.4s]" />
              ) : (
                <ArchiveRestore />
              )}
            </Button>
          ) : (
            <ConfirmDialog
              title="Archivar cliente"
              description={dialogArchive}
              actionConfirm={() => toggleArchiveCustomer()}
              confirmText="Archivar"
              isActionDanger={false}
            >
              <Button
                type="button"
                variant="secondary"
                size="sm"
                title="Archivar"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  /* TODO: Component SpinnerLoading */
                  <div className="size-3 rounded-full border-2 border-gray-600 border-t-transparent animate-spin animation-duration-[0.4s]" />
                ) : (
                  <ArchiveIcon />
                )}
              </Button>
            </ConfirmDialog>
          )}
          <ConfirmDialog
            title="Eliminar cliente"
            description={dialogDelete}
            actionConfirm={() => handleDeleteCustomer()}
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

      <div className="flex items-center gap-2">
        <Phone className="size-4" />
        <p>{customer?.phone || "Sin teléfono"}</p>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="size-4" />
        <p>{customer?.address || "Sin dirección"}</p>
      </div>
      {customer?.isActive === false && (
        <Badge variant="destructive" className="mt-2">
          <ArchiveIcon />
          Archivado
        </Badge>
      )}
    </div>
  );
}

export default CustomerDetails;

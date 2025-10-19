"use client";

import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/api/useCustomers";
import { MapPin, Pencil, Phone, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

function CustomerPage() {
  const params = useParams();
  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!customerId) return <p>El ID del cliente es inválido</p>;
  const { customer, loading, error, getCustomer } = useCustomers({
    autoFetch: true,
    customerId,
  });

  if (error) return <p>{error}</p>;

  return loading ? (
    <p>Loading</p>
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

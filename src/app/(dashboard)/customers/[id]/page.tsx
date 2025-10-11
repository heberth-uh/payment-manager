"use client";

import { useCustomer } from "@/hooks/api/useCustomers";
import { MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

function CustomerPage() {
  const params = useParams();
  const customerId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!customerId) return <p>El ID del cliente es inválido</p>;
  const { customer, loading, error } = useCustomer(customerId);

  if (error) return <p>{error}</p>;

  return loading ? (
    <p>Loading</p>
  ) : (
    <div>
      <h1 className="font-semibold text-lg mb-2">{`${customer?.name}${
        " " + customer?.lastname
      }`}</h1>

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

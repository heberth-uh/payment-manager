"use client";

import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { useCustomers } from "@/hooks/api/useCustomers";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

function CustomersPage() {
  const { data, error, loading, refetch } = useCustomers();

  if (error) {
    return <PageContainer>Error {error}</PageContainer>;
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Clientes</h1>
        <button
          onClick={() => refetch()}
          className="bg-gray-200 p-2 rounded-md"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="mt-4">
          <ul>
            {data?.map((customer) => (
              <li key={customer.id}>
                <Link href={`/customers/${customer.id}`}>
                  {customer.name}
                  {customer.lastname && ` ${customer.lastname}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}

export default CustomersPage;

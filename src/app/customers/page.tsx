"use client";

import { PageContainer } from "@/components/PageContainer";
import React, { Suspense } from "react";
import { useCustomers } from "@/hooks/api/useCustomers";

function CustomersPage() {
  const { data, error, loading } = useCustomers();

  if (error) {
    return <PageContainer>Error {error.message}</PageContainer>;
  }

  return (
    <PageContainer>
      <h1>Clientes</h1>

      {loading && <p>Cargando...</p>}
      <div className="mt-4">
        <ul>
          {data?.map((customer) => (
            <li key={customer.id}>{customer.name}</li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}

export default CustomersPage;

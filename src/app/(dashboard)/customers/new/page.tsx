import CustomerForm from "@/components/CustomerForm";
import { PageContainer } from "@/components/PageContainer";
import React from "react";

function NewCustomerPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl">Nuevo cliente</h1>
      <CustomerForm />
    </PageContainer>
  );
}

export default NewCustomerPage;

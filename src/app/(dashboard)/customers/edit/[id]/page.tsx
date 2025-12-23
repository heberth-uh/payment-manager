import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import CustomerForm from "@/components/customers/CustomerForm";

function EditCustomerPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl">Editar cliente</h1>
      <CustomerForm isEditing />
    </PageContainer>
  );
}

export default EditCustomerPage;

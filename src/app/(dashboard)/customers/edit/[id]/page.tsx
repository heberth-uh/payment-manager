import React from "react";
import { PageContainer } from "@/components/PageContainer";
import CustomerForm from "@/components/CustomerForm";

function EditCustomerPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl">Editar cliente</h1>
      <CustomerForm isEditing />
    </PageContainer>
  );
}

export default EditCustomerPage;

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import CustomerForm from "@/components/customers/CustomerForm";

async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageContainer>
      <h1 className="text-2xl">Editar cliente</h1>
      <CustomerForm isEditing customerId={id} />
    </PageContainer>
  );
}

export default EditCustomerPage;

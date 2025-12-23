import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import SaleForm from "@/components/sales/SaleForm";

function EditSalePage() {
  return (
    <PageContainer>
      <SaleForm isEditing/>
    </PageContainer>
  );
}

export default EditSalePage;

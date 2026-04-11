import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import SaleForm from "@/components/sales/SaleForm";
import { ProductDraftProvider } from "@/contexts/product/ProductDraftContext";

function EditSalePage() {
  return (
    <ProductDraftProvider>
      <PageContainer>
        <SaleForm isEditing/>
      </PageContainer>
    </ProductDraftProvider>
  );
}

export default EditSalePage;

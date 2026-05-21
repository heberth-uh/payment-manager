import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import SaleForm from "@/components/sales/SaleForm";
import { ProductDraftProvider } from "@/contexts/product/ProductDraftContext";

async function EditSalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProductDraftProvider>
      <PageContainer>
        <SaleForm isEditing saleId={id} />
      </PageContainer>
    </ProductDraftProvider>
  );
}

export default EditSalePage;

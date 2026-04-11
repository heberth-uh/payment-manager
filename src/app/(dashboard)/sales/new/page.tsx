import { PageContainer } from "@/components/layout/PageContainer";
import SaleForm from "@/components/sales/SaleForm";
import { ProductDraftProvider } from "@/contexts/product/ProductDraftContext";
import React from "react";

function NewSalePage() {
  return (
    <ProductDraftProvider>
      <PageContainer>
        <h1 className="text-2xl">Nueva venta</h1>
        <SaleForm/>
      </PageContainer>
    </ProductDraftProvider>
  );
}

export default NewSalePage;

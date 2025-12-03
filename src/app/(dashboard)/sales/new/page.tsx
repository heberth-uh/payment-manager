import { PageContainer } from "@/components/PageContainer";
import SaleForm from "@/components/sales/SaleForm";
import React from "react";

function NewSalePage() {
  return (
    <PageContainer>
      <h1 className="text-2xl">Nueva venta</h1>
      <SaleForm/>
    </PageContainer>
  );
}

export default NewSalePage;

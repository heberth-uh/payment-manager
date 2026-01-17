import React from "react";
import ProductForm from "./ProductForm";

interface ProductViewProps {
  mode?: "create" | "edit";
  saleId: string;
  onSuccess?: () => void;
}

function ProductView({ mode, saleId, onSuccess }: ProductViewProps) {
  if (mode === "create") {
    return <ProductForm saleId={saleId} onSuccess={onSuccess} />;
  }
  return (
    <div>
      <div>Product View</div>
    </div>
  );
}

export default ProductView;

import React from "react";
import ProductForm from "./ProductForm";

interface ProductViewProps {
  mode?: "view" | "create" | "edit"; // Maybe we only need "create"and "edit"
  onSuccess?: () => void;
}

function ProductView({ mode = "view", onSuccess }: ProductViewProps) {
  if (mode === "create") {
    return <ProductForm onSuccess={onSuccess} />;
  }
  return (
    <div>
      <div>Product View</div>
    </div>
  );
}

export default ProductView;

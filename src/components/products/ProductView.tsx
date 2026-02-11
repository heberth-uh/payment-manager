import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { Product } from "@/generated/prisma/client";
import ProductDetails from "./ProductDetails";

interface ProductViewProps {
  mode?: "view" | "create" | "edit";
  saleId: string;
  product?: Product;
  closeSheet?: () => void;
}

function ProductView({
  mode: initialMode = "view",
  saleId,
  product,
  closeSheet,
}: ProductViewProps) {
  const [activeMode, setActiveMode] = useState(initialMode);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const openEdit = () => setActiveMode("edit");
  const openView = () => setActiveMode("view");

  // Create mode
  if (activeMode === "create") {
    return (
      <ProductForm saleId={saleId} onCancel={closeSheet} onClose={closeSheet} />
    );
  }

  // Edit mode
  if (activeMode === "edit") {
    return (
      <ProductForm
        saleId={saleId}
        product={product}
        onCancel={openView}
        onClose={openView}
        isEditing
      />
    );
  }

  // No product to show
  if (!product) {
    return (
      <div className="px-4 italic">No hay datos del artículo para mostrar</div>
    );
  }

  // View mode (default)
  return <ProductDetails product={product} onEdit={openEdit} />;
}

export default ProductView;

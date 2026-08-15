import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import { ProductOrDraft } from "./types";

interface ProductViewProps {
  mode?: "view" | "create" | "edit";
  saleId?: string;
  product?: ProductOrDraft;
  isDraftMode?: boolean;
  closeSheet?: () => void;
}

function ProductView({
  mode: initialMode = "view",
  saleId,
  product,
  isDraftMode = false,
  closeSheet,
}: ProductViewProps) {
  const [activeMode, setActiveMode] = useState(initialMode);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  // Handlers to switch between modes
  const openEdit = () => setActiveMode("edit");
  const openView = () => setActiveMode("view");

  // Create mode
  if (activeMode === "create") {
    return (
      <ProductForm
        saleId={saleId}
        isDraftMode={isDraftMode}
        onCancel={closeSheet}
        onClose={closeSheet}
      />
    );
  }

  // Edit mode
  if (activeMode === "edit") {
    return (
      <ProductForm
        saleId={saleId}
        product={product}
        isDraftMode={isDraftMode}
        onCancel={openView}
        onClose={openView}
        isEditing
      />
    );
  }

  // No product to show
  if (!product) {
    return (
      <div className="px-4 italic">No hay datos del producto para mostrar</div>
    );
  }

  // View mode (default)
  return (
    <ProductDetails
      product={product}
      isDraftMode={isDraftMode}
      onEdit={openEdit}
      closeSheet={closeSheet}
    />
  );
}

export default ProductView;

"use client";

import { ProductFormData } from "@/lib/validations/product.schema";
import { SaleProductData } from "@/lib/validations/sale.schema";
import { calculateProductTotals } from "@/lib/utils/productTotals";
import { createContext, useContext, useState } from "react";

interface ProductDraftContextType {
  drafts: SaleProductData[];
  addProductDraft: (data: ProductFormData) => void;
  updateProductDraft: (id: string, data: Partial<SaleProductData>) => void;
  deleteProductDraft: (id: string) => void;
}

const ProductDraftContext = createContext<ProductDraftContextType | null>(null);

export function ProductDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drafts, setDrafts] = useState<SaleProductData[]>([]);

  // CREATE DRAFT
  const addProductDraft = (data: ProductFormData) => {
    const { storedTotals } = calculateProductTotals(
      data.unitPrice,
      data.purchasePrice,
      data.quantity,
    );
    setDrafts((prevDrafts) => [
      ...prevDrafts,
      { ...data, id: crypto.randomUUID(), ...storedTotals },
    ]);
  };

  // UPDATE DRAFT
  const updateProductDraft = (id: string, data: Partial<SaleProductData>) => {
    setDrafts((prevDrafts) =>
      prevDrafts.map((draft) => {
        if (draft.id !== id) return draft;
        const merged = { ...draft, ...data };
        const { storedTotals } = calculateProductTotals(
          merged.unitPrice,
          merged.purchasePrice,
          merged.quantity,
        );
        return { ...merged, ...storedTotals };
      }),
    );
  };

  // DELETE DRAFT
  const deleteProductDraft = (id: string) => {
    setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
  };

  return (
    <ProductDraftContext.Provider
      value={{
        drafts,
        addProductDraft,
        updateProductDraft,
        deleteProductDraft,
      }}
    >
      {children}
    </ProductDraftContext.Provider>
  );
}

export function useProductDraft() {
  const context = useContext(ProductDraftContext);
  if (!context) {
    throw new Error("useProductDraft must be used within ProductDraftProvider");
  }
  return context;
}

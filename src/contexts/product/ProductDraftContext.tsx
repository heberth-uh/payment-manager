"use client";

import { ProductFormData } from "@/lib/validations/product.schema";
import { SaleProductData } from "@/lib/validations/sale.schema";
import { createContext, useContext, useState } from "react";

/* 
Basic context is created
TODO:
    - ✅ Wrap the SaleForm (/sales/{new|create|[id]}/page.tsx) with the ProductDraftProvider
    - ✅ Call drafts in the ProductListSection to show the products in the list
    - Add handlers for drafts context:
      - ✅ to add
      - update
      - remove
    - Add functions to get totals
*/

interface ProductDraftContextType {
  drafts: SaleProductData[];
  addProductDraft: (product: ProductFormData) => void;
}

const ProductDraftContext = createContext<ProductDraftContextType | null>(null);

export function ProductDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drafts, setDrafts] = useState<SaleProductData[]>([]);

  const addProductDraft = (product: ProductFormData) => {
    const productWithDraftData: SaleProductData = {
      ...product,
      id: crypto.randomUUID(),
      // TODO: Test with deciamns to use Math.round() to avoid floating point issues (e.g., 0.1 * 3 = 0.30000000000000004)
      subtotal: product.unitPrice * product.quantity,
      profit: (product.unitPrice - product.purchasePrice) * product.quantity,
    };
    setDrafts((prevDrafts) => [...prevDrafts, productWithDraftData]);
  };

  return (
    <ProductDraftContext.Provider
      value={{
        drafts,
        addProductDraft,
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

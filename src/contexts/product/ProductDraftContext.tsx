"use client";

import {
  ProductDraftData,
  ProductFormData,
} from "@/lib/validations/product.schema";
import { calculateProductTotals } from "@/lib/utils/productTotals";
import { createContext, useCallback, useContext, useState } from "react";
import { Product } from "@/generated/prisma/client";
import {
  buildProductDraftPatch,
  productToDraft,
} from "@/lib/utils/productDraft";
import { stripUnchangedFields } from "@/lib/utils/draft";

interface ProductDraftContextType {
  drafts: ProductDraftData[];
  seededDrafts: Map<string, ProductDraftData>;
  draftUpdates: Map<string, Partial<ProductDraftData>>;
  addProductDraft: (data: ProductFormData) => void;
  updateProductDraft: (id: string, data: Partial<ProductDraftData>) => void;
  deleteProductDraft: (id: string) => void;
  loadDraftsFromProducts: (products: Product[]) => void;
  getProductChanges: () => {
    create: ProductDraftData[];
    update: (Partial<ProductDraftData> & { id: string })[];
    deleteIds: string[];
    hasChanges: boolean;
  };
}

const ProductDraftContext = createContext<ProductDraftContextType | null>(null);

export function ProductDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drafts, setDrafts] = useState<ProductDraftData[]>([]);
  const [seededDrafts, setSeededDrafts] = useState<
    Map<string, ProductDraftData>
  >(new Map());
  const [draftUpdates, setDraftUpdates] = useState<
    Map<string, Partial<ProductDraftData>>
  >(new Map());

  // Seed drafts from products, used when editing a sale.
  const loadDraftsFromProducts = useCallback((products: Product[]) => {
    const seeded = products.map(productToDraft);
    setDrafts(seeded); // Populate drafts with products (to sync edited data with UI)
    setSeededDrafts(new Map(seeded.map((d) => [d.id, d]))); // Snapshot of the products before edition (baseline for diffs and delete detection)
    setDraftUpdates(new Map()); // Reset accumulated patches for edited seeded drafts
  }, []);

  // Build product changes for sale update
  const getProductChanges = () => {
    const draftIds = new Set(drafts.map((d) => d.id));

    const create = drafts.filter((d) => !seededDrafts.has(d.id));
    const update = [...draftUpdates]
      .filter(([id]) => seededDrafts.has(id))
      .map(([id, changes]) => ({
        id,
        ...changes,
      }));
    const deleteIds = [...seededDrafts.keys()].filter(
      (id) => !draftIds.has(id),
    );
    const hasChanges = create.length + update.length + deleteIds.length > 0;

    return { create, update, deleteIds, hasChanges };
  };

  // CREATE DRAFT
  const addProductDraft = useCallback((data: ProductFormData) => {
    const { storedTotals } = calculateProductTotals(
      data.unitPrice,
      data.purchasePrice,
      data.quantity,
    );
    setDrafts((prevDrafts) => [
      ...prevDrafts,
      { ...data, id: crypto.randomUUID(), ...storedTotals },
    ]);
  }, []);

  // UPDATE DRAFT
  const updateProductDraft = useCallback(
    (id: string, data: Partial<ProductDraftData>) => {
      const current = drafts.find((d) => d.id === id);
      const patch = buildProductDraftPatch(current, data);

      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) =>
          draft.id === id ? { ...draft, ...patch } : draft,
        ),
      );

      setDraftUpdates((prev) => {
        const seeded = seededDrafts.get(id);
        if (!seeded) return prev;

        const next = new Map(prev);
        const merged = {
          ...(next.get(id) ?? {}),
          ...patch,
        };

        const cleanedPatch = stripUnchangedFields(seeded, merged);

        if (Object.keys(cleanedPatch).length === 0) {
          next.delete(id);
        } else {
          next.set(id, cleanedPatch);
        }

        return next;
      });
    },
    [drafts, seededDrafts],
  );

  // DELETE DRAFT
  const deleteProductDraft = useCallback((id: string) => {
    setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
    setDraftUpdates((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <ProductDraftContext.Provider
      value={{
        drafts,
        seededDrafts,
        draftUpdates,
        addProductDraft,
        updateProductDraft,
        deleteProductDraft,
        loadDraftsFromProducts,
        getProductChanges,
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

import React from "react";
import SideSheet from "../ui/SideSheet";
import ProductView from "./ProductView";
import { Button } from "../ui/button";
import { ProductOrDraft } from "./types";

interface ProductListSectionProps {
  products: ProductOrDraft[];
  saleId?: string;
  isDraftMode?: boolean;
}

function ProductListSection({
  products,
  saleId,
  isDraftMode = false,
}: ProductListSectionProps) {
  return (
    <div className="mt-6 mb-2 border rounded-sm p-2">
      {products?.length ? (
        <>
          <div className="flex justify-between items-center">
            <h3>Productos ({products.length})</h3>
            <SideSheet
              title="Crear producto"
              description="Descripción opcional"
              content={(closeSheet) => (
                <ProductView
                  mode="create"
                  saleId={saleId}
                  isDraftMode={isDraftMode}
                  closeSheet={closeSheet}
                />
              )}
            >
              <Button variant="default" size="sm">
                {/* TODO: Disable button (and product list items) when is loading (action from SaleForm) */}
                + Nuevo
              </Button>
            </SideSheet>
          </div>
          <div className="mt-2 space-y-2">
            {products.map((product) => (
              <SideSheet
                key={product.id}
                title={"Detalles del artículo"}
                content={(closeSheet) => (
                  <ProductView
                    saleId={saleId}
                    product={product}
                    isDraftMode={isDraftMode}
                    closeSheet={closeSheet}
                  />
                )}
              >
                <div className="flex justify-between items-center bg-gray-50 border rounded-sm p-2 cursor-pointer">
                  <div className="w-4/5 space-y-1">
                    <p className="text-sm line-clamp-1">{product.name}</p>
                    <div className="flex justify-between items-center text-xs italic">
                      <p>{product.saleDate.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-1/5 text-right">
                    <p className="font-semibold text-sm">
                      $
                      {product.subtotal || product.unitPrice * product.quantity}
                    </p>
                    <p className="text-xs">&times;{product.quantity}</p>
                  </div>
                </div>
              </SideSheet>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span>No hay productos</span>
          <SideSheet
            title="Crear producto"
            description="Descripción opcional"
            content={(closeSheet) => (
              <ProductView
                mode="create"
                saleId={saleId}
                isDraftMode={isDraftMode}
                closeSheet={closeSheet}
              />
            )}
          >
            <Button variant="default" size="sm">
              + Nuevo
            </Button>
          </SideSheet>
        </div>
      )}
    </div>
  );
}

export default ProductListSection;

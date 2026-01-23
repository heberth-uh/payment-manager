import React from "react";
import ProductForm from "./ProductForm";
import { Product } from "@/generated/prisma/client";
import { Label } from "../ui/label";

interface ProductViewProps {
  mode?: "create" | "edit";
  saleId: string;
  product?: Product;
  onSuccess?: () => void;
}

function ProductView({ mode, saleId, product, onSuccess }: ProductViewProps) {
  if (mode === "create") {
    return <ProductForm saleId={saleId} onSuccess={onSuccess} />;
  }

  if (!product) {
    return (
      <div className="px-4 italic">No hay datos del artículo para mostrar</div>
    );
  }

  const profitPerUnit = product.unitPrice - product.purchasePrice;
  const totalMargin = product.purchasePrice > 0 
    ? (profitPerUnit / product.purchasePrice) * 100 
    : 0;
  const totalCost = product.purchasePrice * product.quantity;
  // TODO: Format url. Get only the domain by a function

  return (
    <div className="px-4 flex flex-col gap-6 text-sm mb-4 overflow-hidden">
      <h3 className="font-bold text-base">{product.name}</h3>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="uppercase font-bold text-gray-400 tracking-wider">
            Fecha de venta
          </Label>
          <p>
            {product.saleDate.toLocaleString().split("T")[0]}
            {/* TODO: Create a function to format dates */}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="uppercase font-bold text-gray-400 tracking-wider">
            Cantidad
          </Label>
          <p>
            {product.quantity}
            {(product.quantity || 0) > 1 ? " unidades" : " unidad"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label className="uppercase font-bold text-gray-400 tracking-wider">
          Detalle de precios
        </Label>
        {product.quantity > 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-semibold text-gray-600">Precio de venta</p>
              <p className="font-bold justify-self-end">
                ${product.unitPrice.toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-semibold text-gray-600">Costo unitario</p>
              <p className="font-bold justify-self-end">
                ${product.purchasePrice.toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-semibold text-gray-600">Ganancia unitaria</p>
              <p className="font-bold justify-self-end">
                ${profitPerUnit.toFixed(2)}
                <span className="text-gray-400 ml-2">
                  ({totalMargin.toFixed(2)}%)
                </span>
              </p>
            </div>
            <hr />
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Subtotal de venta</p>
          <p className="font-bold justify-self-end">
            ${product.subtotal.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Costo total</p>
          <p className="font-bold justify-self-end">${totalCost.toFixed(2)}</p>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Ganancia total</p>
          <p className="font-bold justify-self-end">${product.profit.toFixed(2)}</p>
        </div>
      </div>
      {product.url && (
        <div className="flex flex-col gap-2">
          <Label className="uppercase font-bold text-gray-400 tracking-wider">
            Link del artículo
          </Label>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline line-clamp-2"
          >
            {product.url}
          </a>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label className="uppercase font-bold text-gray-400 tracking-wider">
          Notas
        </Label>
        <p>
          {product.note || (
            <span className="text-gray-400 italic">Sin notas</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default ProductView;

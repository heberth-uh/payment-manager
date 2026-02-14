"use client";

import { Product } from "@/generated/prisma/client";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Button } from "../ui/button";
import { getURLDomain } from "@/lib/utils/url-helper";
import ConfirmaDialog from "../ui/ConfirmaDialog";
import { useSales } from "@/contexts/sale/SaleContext";
import { toast } from "sonner";
import { extractDateOnly } from "@/lib/utils/date";

interface ProductDetailsProps {
  product: Product;
  onEdit?: () => void;
}

function ProductDetails({ product, onEdit }: ProductDetailsProps) {
  const { deleteProduct, isSubmitting } = useSales();
  const profitPerUnit = product.unitPrice - product.purchasePrice;
  const marginPercent =
    product.purchasePrice > 0
      ? (profitPerUnit / product.purchasePrice) * 100
      : 0;
  const totalCost = product.purchasePrice * product.quantity;

  const handleDelete = async () => {
    const success = await deleteProduct(product.id);
    if (!success) {
      toast.error("Ocurrió un error al eliminar este artículo");
      return;
    }
    toast.success("Artículo eliminado");
  };

  return (
    <div className="px-4 flex flex-col gap-6 text-sm mb-4 overflow-hidden">
      {onEdit && (
        <div className="flex gap-2">
          <Button onClick={onEdit}>Editar</Button>
          <ConfirmaDialog
            actionConfirm={handleDelete}
            title={"Eliminar artículo"}
            description={
              "¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
            }
            confirmText="Sí, eliminar"
          >
            <Button type="button" variant="secondary" title="Eliminar" disabled={isSubmitting}>
              Eliminar
            </Button>
          </ConfirmaDialog>
        </div>
      )}
      <h3 className="font-bold text-base">{product.name}</h3>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="uppercase font-bold text-gray-400 tracking-wider">
            Fecha de venta
          </Label>
          <p>
            {extractDateOnly(product.saleDate)}
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
              <p className="font-semibold text-gray-600">Costo unitario</p>
              <p className="font-bold justify-self-end">
                ${product.purchasePrice.toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-semibold text-gray-600">Precio de venta</p>
              <p className="font-bold justify-self-end">
                ${product.unitPrice.toFixed(2)}
              </p>
            </div>
            <hr />
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Costo total</p>
          <p className="font-bold justify-self-end">${totalCost.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Subtotal de venta</p>
          <p className="font-bold justify-self-end">
            ${product.subtotal.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Ganancia unitaria</p>
          <p className="font-bold justify-self-end">
            ${profitPerUnit.toFixed(2)}
            <span className="text-gray-400 ml-2">
              ({marginPercent.toFixed(2)}%)
            </span>
          </p>
        </div>
        <hr />
        <div className="grid grid-cols-2 gap-4">
          <p className="font-semibold text-gray-600">Ganancia total</p>
          <p className="font-bold justify-self-end">
            ${product.profit.toFixed(2)}
          </p>
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
            {getURLDomain(product.url) || product.url}
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

export default ProductDetails;

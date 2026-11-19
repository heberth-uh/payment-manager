import { Prisma } from "@/generated/prisma/client";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError, unauthorizedResponse } from "@/lib/utils/api-error";
import { calculateProductTotals } from "@/lib/utils/productTotals";
import { UpdateSaleSchema } from "@/lib/validations/sale.schema";
import { NextRequest, NextResponse } from "next/server";

// Get a sale
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const sale = await prisma.sale.findUnique({
      include: { customer: true, products: true },
      where: { id, userId: session?.user.id },
    });

    if (!sale) {
      return NextResponse.json(
        { message: "Venta no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Sale retrieved successfully", data: sale },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a sale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const session = await getServerSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Validate the request body
    const parsed = UpdateSaleSchema.parse(body);
    const { products, ...saleData } = parsed;

    // Verify customer ownership
    if (saleData.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: saleData.customerId, userId: session.user.id },
        select: { id: true },
      });
      if (!customer) {
        return NextResponse.json(
          { message: "Cliente no encontrado" },
          { status: 404 },
        );
      }
    }

    const updatedSale = await prisma.$transaction(async (tx) => {
      // Verify sale ownership
      await tx.sale.findUniqueOrThrow({
        where: { id, userId: session.user.id },
        select: { id: true },
      });

      // Product deletes
      if (products?.deleteIds.length) {
        await tx.product.deleteMany({
          where: { id: { in: products.deleteIds }, saleId: id },
        });
      }

      // Product updates
      for (const { id: productId, ...changes } of products?.update ?? []) {
        let updateData = { ...changes };
        const shouldRecalculateTotals =
          "unitPrice" in changes ||
          "purchasePrice" in changes ||
          "quantity" in changes;
        if (shouldRecalculateTotals) {
          const currentProduct = await tx.product.findUniqueOrThrow({
            where: { id: productId, saleId: id },
          });
          const merged = { ...currentProduct, ...changes };
          const { storedTotals } = calculateProductTotals(
            merged.unitPrice,
            merged.purchasePrice,
            merged.quantity,
          );
          updateData = { ...changes, ...storedTotals };
        }
        await tx.product.update({
          where: { id: productId, saleId: id },
          data: updateData,
        });
      }

      // Product creates
      for (const product of products?.create ?? []) {
        const { storedTotals } = calculateProductTotals(
          product.unitPrice,
          product.purchasePrice,
          product.quantity,
        );
        await tx.product.create({
          data: {
            ...product,
            ...storedTotals,
            saleId: id,
            userId: session.user.id,
          },
        });
      }

      // Sale update
      const saleUpdateData: Prisma.SaleUpdateInput = { ...saleData };
      if (products?.create.length) {
        saleUpdateData.lastSaleDate = new Date();
      }
      if (Object.keys(saleUpdateData).length > 0) {
        await tx.sale.update({
          where: { id, userId: session.user.id },
          data: saleUpdateData,
        });
      }

      // Return fresh sale data
      return tx.sale.findUniqueOrThrow({
        where: { id, userId: session.user.id },
        include: { customer: true, products: true },
      });
    });

    return NextResponse.json({
      message: "Sale updated successfully",
      data: updatedSale,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a sale
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const result = await prisma.sale.delete({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({
      message: "Sale deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError, unauthorizedResponse } from "@/lib/utils/api-error";
import { UpdateCustomerSchema } from "@/lib/validations/customer.schema";
import { NextRequest, NextResponse } from "next/server";

// Get a customer
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

    const result = await prisma.customer.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Customer retrieved successfully", data: result },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a customer
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
    const data = UpdateCustomerSchema.parse(body);

    const result = await prisma.customer.update({
      where: { id, userId: session.user.id },
      data,
    });

    return NextResponse.json({
      message: "Customer updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a customer
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

    // Block deleting a customer with sales
    const hasSales = await prisma.sale.findFirst({
      where: { customerId: id, userId: session.user.id },
      select: { id: true },
    });
    if (hasSales) {
      return NextResponse.json(
        {
          message:
            "No se puede eliminar un cliente con ventas. Archívalo en su lugar.",
        },
        { status: 409 },
      );
    }

    const result = await prisma.customer.delete({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({
      message: "Customer deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

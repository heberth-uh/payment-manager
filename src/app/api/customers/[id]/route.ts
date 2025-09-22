import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { NextRequest, NextResponse } from "next/server";

// Get a customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Customer retrieved successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// Edit a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await prisma.customer.update({
      where: { id: params.id },
      data: body,
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.customer.delete({
      where: { id: params.id },
    });
    return NextResponse.json({
      message: "Customer deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

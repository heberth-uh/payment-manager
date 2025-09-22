import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { NextRequest } from "next/server";

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
    return Response.json(
      { message: "Customer updated successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

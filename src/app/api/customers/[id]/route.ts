import { prisma } from "@/lib/prisma";
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
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

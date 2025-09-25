import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { CreateCustomerSchema } from "@/lib/validations/customer.schema";

// Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const customers = await prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });

    return NextResponse.json({ data: customers }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const data = CreateCustomerSchema.parse(body);

    const result = await prisma.customer.create({ data });

    return NextResponse.json(
      { message: "Customer created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

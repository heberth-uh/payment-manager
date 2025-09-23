import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";

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
    const { name, lastname, phone, address } = await request.json();

    const result = await prisma.customer.create({
      data: {
        name,
        lastname,
        phone,
        address,
        // TODO: add CreatedBy column
      },
    });
    return NextResponse.json(
      { message: "Customer created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

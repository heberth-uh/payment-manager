import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { CreateCustomerSchema } from "@/lib/validations/customer.schema";
import { getServerSession } from "@/lib/get-session";

// Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
            userId: session.user.id,
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
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate the request body
    const parsedData = CreateCustomerSchema.parse(body);

    const result = await prisma.customer.create({
      data: {
        ...parsedData,
        userId: session.user.id,
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

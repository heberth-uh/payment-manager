import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, unauthorizedResponse } from "@/lib/utils/api-error";
import { CreateCustomerSchema } from "@/lib/validations/customer.schema";
import { getServerSession } from "@/lib/get-session";

const MAX_LIMIT = 50;

// Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const archived = searchParams.get("archived");
    const session = await getServerSession();

    const parsedLimit = Number(limit);
    const take =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : undefined;

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const customers = await prisma.customer.findMany({
      where: {
        userId: session.user.id,
        isActive: archived !== "true",
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { lastname: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
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
      return unauthorizedResponse();
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
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

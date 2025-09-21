import { NextRequest } from "next/server";
import { prisma } from "@lib/prisma";

// Get all customers
export async function GET(request: NextRequest) {
  try {
    const customers = await prisma.customer.findMany();
    return Response.json({ data: customers }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
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
    return Response.json(
      { message: "Customer created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

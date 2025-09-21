import { NextRequest } from "next/server";
import { prisma } from "@lib/prisma";

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

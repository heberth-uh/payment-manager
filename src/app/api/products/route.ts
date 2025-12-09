import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/api-error";
import { NextRequest, NextResponse } from "next/server";

// Get all products
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: {
        userId: session?.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

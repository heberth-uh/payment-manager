import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return NextResponse.json(
          { message: "Registro no encontrado" },
          { status: 404 }
        );
      case "P2002":
        return NextResponse.json(
          { message: "Ya existe un registro con esos datos" },
          { status: 409 }
        );
      default:
        return NextResponse.json(
          { message: "Error desconocido" },
          { status: 500 }
        );
    }
  }

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}

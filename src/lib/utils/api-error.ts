import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import z from "zod";

/**
 * Formats Zod issues into readable "path: message" strings, one per issue.
 *
 * @param issues - the `error.issues` array from a caught ZodError.
 * @returns array of strings like `"products.0.saleDate: Invalid date"`.
 */
export function formatZodIssues(issues: z.core.$ZodIssue[]): string[] {
  return issues.map((i) => {
    const path = i.path.length ? i.path.join(".") : "(root)";
    return `${path}: ${i.message}`;
  });
}

export function handleApiError(error: unknown) {
  // Prisma known errors
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

  // Zod validation error
  if (error instanceof z.ZodError) {
    const formatted = formatZodIssues(error.issues);
    console.error("Validation error:", formatted);
    return NextResponse.json(
      { message: "Error de validación", errors: error.issues },
      { status: 400 }
    );
  }

  // Generic or unknown error
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}

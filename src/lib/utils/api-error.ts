export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
  return Response.json({ message: "Internal Server Error" }, { status: 500 });
}

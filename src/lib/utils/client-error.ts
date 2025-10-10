export function handleClientError(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido";
}

/**
 * Converts an unknown error to a readable string message.
 * Handles Error instances and unknown error types.
 *
 * @param error - The error object (typically caught from try-catch)
 * @returns A string message. Returns error.message if Error instance, otherwise "Error desconocido"
 */
export function handleClientError(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido";
}

/**
 * Extracts error message from HTTP response.
 * Attempts to parse response as JSON and extract the message field.
 * Falls back to default message if response is not JSON or lacks message field.
 *
 * @param response - The failed HTTP Response object
 * @param defaultMessage - Fallback message if response cannot be parsed
 * @returns Promise resolving to error message string
 */
export async function extractErrorMessage(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

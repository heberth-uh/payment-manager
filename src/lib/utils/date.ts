/**
 * Converts a Date object to a local ISO date string (YYYY-MM-DD),
 * preserving the user's timezone (no UTC shift).
 *
 * @param date - a Date object, e.g. `new Date()`.
 * @returns the local-date portion as a string, e.g. `"2026-05-31"`.
 */
export function toLocalISODate(date: Date): string {
  const local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toISOString().split("T")[0];
}

/**
 * Returns today's date as a local ISO date string (YYYY-MM-DD).
 *
 * @returns today's local date as a string, e.g. `"2026-05-31"`.
 */
export function getTodayLocalISODate(): string {
  return toLocalISODate(new Date());
}

/**
 * Extracts the date portion from a Date object or an ISO datetime string,
 * preserving the user's timezone. Useful to populate `<input type="date">` values.
 *
 * @param date - a Date object, or an ISO datetime string, e.g. `"2026-05-31T12:00:00Z"`.
 * @returns the date-only string, e.g. `"2026-05-31"`.
 */
export function extractDateOnly(date: Date | string): string {
  if (date instanceof Date) {
    return toLocalISODate(date);
  }
  return date.split("T")[0];
}

/**
 * Parses a date-only string (YYYY-MM-DD) as UTC midnight
 * Date-only values are always stored and displayed in UTC to avoid day shifts.
 *
 * @param dateString - a date string in YYYY-MM-DD format, e.g. `"2026-11-15"`.
 * @returns a Date at UTC midnight, e.g. `2026-11-15T00.00.000Z`.
 */
export function parseDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/**
 * Formats a date into a human-readable string (date + time) using the system locale.
 * Returns `"-"` when the input is missing or invalid.
 *
 * @param date - a Date object, an ISO datetime string, `null`, or `undefined`.
 * @returns the formatted string (locale-dependent),
 *          e.g. `"31/5/2026, 11:59:59 p. m."`, or `"-"` when input is missing/invalid.
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) return "-";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }
  return parsedDate.toLocaleString();
}

/**
 * Formats a date-only value (stored at UTC midnight) without shifting the day.
 *
 * @param date - a Date object, an ISO datetime string, `null` or `undefined`.
 * @returns the local date, e.g. `"11/15/2026"`, or `"-"` when missing/invalid.
 */
export function formatDateOnly(date?: string | Date | null): string {
  if (!date) return "-";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString(undefined, { timeZone: "UTC" });
}

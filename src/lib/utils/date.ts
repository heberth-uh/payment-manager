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
 * Parses a local ISO date string (YYYY-MM-DD) into a Date object at local midnight.
 * Falls back to today's date if the input is undefined.
 *
 * @param dateString - a date string in YYYY-MM-DD format, e.g. `"2026-05-31"`, or `undefined`.
 * @returns a Date object at local midnight (e.g. `Date "2026-05-31T00:00:00 local"`),
 *          or today's Date when the input is `undefined`.
 */
export function parseLocalDate(dateString: string | undefined): Date {
  if (!dateString) {
    return new Date();
  }
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
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

/*
 * Converts a Data object to a local ISO date string (YYYY-MM-DD)
 *
 * @para date - the date object to convert
 * @returns the local ISO date string
 */
export function toLocalISODate(date: Date) {
  const local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toISOString().split("T")[0];
}

/*
 * Gets today's date in local ISO format (YYYY-MM-DD)
 *
 * @returns today's date as a local ISO date string
 */
export function getTodayLocalISODate() {
  return toLocalISODate(new Date());
}

/*
 * Formats a date string to local ISO date string (YYYY-MM-DD)
 *
 * @param dateString - the date string to format
 * @returns the local ISO date string
 */
export function extractDateOnly(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return date.split("T")[0];
}

/*
 * Parses a local ISO date string (YYYY-MM-DD) to a Date object
 *
 * @param dateString - the local ISO date string to parse
 * @returns the parsed Date object
 */
export function parseLocalDate(dateString: string | undefined): Date {
  if (!dateString) {
    return new Date();
  }
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

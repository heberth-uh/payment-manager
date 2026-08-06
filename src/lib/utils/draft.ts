/**
 * Removes fields from a partial patch whose values match the original.
 * Uses shallow strict equality; nested objects are compared by reference.
 *
 * @param original - the baseline object to compare against (e.g. the seeded draft).
 * @param patch - the partial patch containing candidate updates.
 * @returns a new partial containing only the fields whose values differ from `original`.
 */
export function stripUnchangedFields<T extends object>(
  original: T,
  patch: Partial<T>,
): Partial<T> {
  const result: Partial<T> = { ...patch };

  for (const key of Object.keys(result) as (keyof T)[]) {
    if (result[key] === original[key]) delete result[key];
  }

  return result;
}

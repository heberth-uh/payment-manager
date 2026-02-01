/*
 * Extracts the domain from a given URL string.
 *
 * @param url - the URL string to extract the domain from
 * @returns the domain as a string, or null if url is an invalid URL
 */
export const getURLDomain = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const domain = new URL(url);
    return domain.hostname.replace("www.", "");
  } catch {
    return null;
  }
};

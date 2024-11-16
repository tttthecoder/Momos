export function isValidUrl(str: string) {
  try {
    new URL(str); // Checks if the URL is structurally valid
    return true;
  } catch {
    return false;
  }
}

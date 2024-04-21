import jwt from "~/lib/utils/functions/jwt"

/**
 * Identifies the type of username (email or phone number) based on the provided string.
 * @param {string} string - The string to identify the username type from.
 * @returns {("email" | "phone" | "unknown")} The type of username identified.
 *
 * @example
 * const username = "example@example.com";
 * const usernameType = identifyUsernameType(username);
 * console.log(usernameType); // Output: "email"
 */
export function identifyUsernameType(
  string: string,
): "email" | "phone" | "unknown" {
  const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/
  const phonePattern = /^(\+\d{1,2}\s?)?\d{10,15}$/

  if (emailPattern.test(string)) return "email"

  if (phonePattern.test(string)) return "phone"

  return "unknown"
}

/**
 * Creates the expiry timestamp for the given authentication token.
 * @param {string} authToken - The authentication token.
 * @returns {number} The expiry timestamp in milliseconds.
 */
export function createTokenExpiry(authToken: string): number {
  const payload = jwt.decode.parse(authToken)

  return new Date(payload.exp * 1000).getTime()
}

/**
 * Checks if the provided timestamp is expired compared to the current timestamp.
 * @param {number} timestamp - The timestamp to compare with the current timestamp.
 * @returns {boolean} True if the provided timestamp is expired, otherwise false.
 */
export function isTokenExpired(timestamp: number): boolean {
  const currentTimestamp: number = new Date().getTime()

  return currentTimestamp >= timestamp
}

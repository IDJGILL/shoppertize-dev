/**
 * Identifies username type from a string
 */
export function identifyUsernameType(string: string) {
  const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/
  const phonePattern = /^(\+\d{1,2}\s?)?\d{10,15}$/

  if (emailPattern.test(string)) return "email"

  if (phonePattern.test(string)) return "phone"

  return "unknown"
}

type AsyncFunction<T, U extends unknown[]> = (...args: U) => Promise<T>

/**
 * Executes an asynchronous function safely, catching any errors that might occur during its execution.
 *
 * @param {(...args: U) => Promise<T>} func - The asynchronous function to be executed safely.
 * @returns {Promise<T | null>} A Promise that resolves to the result of the function if it succeeds, or null if it encounters an error.
 *
 * @example
 * const safeGetAuthenticationSession = safeAsync(getAuthenticationSession);
 * const session = await safeGetAuthenticationSession(props.id!);
 */
export async function safeAsync<T, U extends unknown[]>(
  func: AsyncFunction<T, U>,
  ...args: U
): Promise<T | null> {
  return await func(...args).catch(() => null)
}

export const waitAsync = (forMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, forMs))
}

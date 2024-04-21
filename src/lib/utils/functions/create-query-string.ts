export const createQueryString = (params: DynamicObject<string[]>) => {
  return Object.entries(params)
    .map(
      ([key, values]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(values.join("-"))}`,
    )
    .flat()
    .join("&")
}

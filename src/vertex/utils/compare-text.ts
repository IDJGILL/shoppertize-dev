export const compareText = (source: string, compare: string) => {
  const regex = new RegExp(compare, "g")
  return regex.test(source)
}

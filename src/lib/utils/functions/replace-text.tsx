export const replaceText = (options: {
  source: string
  matcher: string
  replaceWith: string
}) => {
  return options.source
    .split(" ")
    .map((a) => (a === options.matcher ? options.replaceWith : a))
    .join(" ")
}

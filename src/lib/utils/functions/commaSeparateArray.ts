export function commaSeparateArray(props: string[]) {
  if (props.length > 1) {
    return `${props.slice(0, -1).join(", ")} and ${props[props.length - 1]}`
  }

  return props.join(", ")
}

export const createFetchTag = (name: string, id: string) => {
  return btoa(`${name}:${id}`)
}

export const decodeFetchTag = (tag: string) => {
  const tags = atob(tag)

  const name = tags.split(':')[0]!
  const id = tags.split(':')[1]!

  return {
    name,
    id,
  }
}

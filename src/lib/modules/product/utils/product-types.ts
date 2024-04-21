export type SearchTerm = {
  title: string
  tags: string[]
  slug: string
}

export type Category = {
  id: string
  name: string
  slug: string
  childrens: {
    id: string
    name: string
    slug: string
  }[]
  hasChildren: boolean
}

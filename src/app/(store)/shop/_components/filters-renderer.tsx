"use client"

import FiltersSection from "./filters-section"
import FiltersFooter from "./filters-footer"

interface FiltersRendererProps extends React.HTMLAttributes<HTMLElement> {}

export default function FiltersRenderer({ ...props }: FiltersRendererProps) {
  const {} = props

  return (
    <>
      <FiltersSection />

      <FiltersFooter />
    </>
  )
}

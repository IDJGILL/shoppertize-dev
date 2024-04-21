export function highlightSection(id: string) {
  const section = document.getElementById(id)

  if (!section) return

  section.classList.add("highlight")

  section.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  })

  setTimeout(function () {
    section.classList.remove("highlight")
  }, 1600)
}

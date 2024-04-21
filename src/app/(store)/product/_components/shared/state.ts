import { atom } from "jotai"

export type FullScreenProductViewAtomType = {
  view: "desktop" | "mobile" | null
  index: number
}

export const fullScreenProductViewAtom = atom<FullScreenProductViewAtomType>({
  view: null,
  index: 0,
})

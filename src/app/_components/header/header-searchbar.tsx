"use client"

import { atom, useAtom } from "jotai"
import Skeleton from "react-loading-skeleton"
import dynamic from "next/dynamic"

export const showSearchAtom = atom(false)

const SearchBarRenderer = dynamic(() => import("./search-bar-renderer"), {
  ssr: false,
  loading: () => (
    <div className="hidden max-w-2xl flex-1 md:block">
      <Skeleton className="h-10 w-full" />
    </div>
  ),
})

export default function HeaderSearchBar({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props
  const [isShowing, setShow] = useAtom(showSearchAtom)

  // return <SearchBarRenderer isShowing={isShowing} setShow={setShow} />

  return <></>
}

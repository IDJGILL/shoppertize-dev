"use client"

import { useAtom } from "jotai"
import { showSearchAtom } from "./header-searchbar"
import { Search } from "lucide-react"
import { cn } from "~/lib/utils/functions/ui"

// interface SearchTriggerProps extends React.HTMLAttributes<HTMLElement> {}

export default function SearchTrigger({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props
  const [isShowing, setShowSearch] = useAtom(showSearchAtom)

  return (
    // <Search
    //   className={cn("w-[22px] md:hidden md:w-5", {
    //     "stroke-secondary": isShowing,
    //   })}
    //   onClick={() => setShowSearch((prev) => !prev)}
    // />

    <></>
  )
}

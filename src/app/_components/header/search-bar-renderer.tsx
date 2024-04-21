"use client"

import { useUpdateEffect } from "react-use"
import useSearch from "~/lib/utils/hooks/useSearch"
import { cn } from "~/lib/utils/functions/ui"
import { Input } from "../ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { storeNavigations } from "~/lib/utils/constants/navigations"
import { type InputHTMLAttributes } from "react"
import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"
import type { SearchTerm } from "~/lib/modules/product/utils/product-types"

interface SearchBarRendererProps extends React.HTMLAttributes<HTMLElement> {
  isShowing: boolean
  setShow: (state: boolean) => void
}

export default function SearchBarRenderer({
  ...props
}: SearchBarRendererProps) {
  const { isShowing, setShow } = props
  const breakpoint = useBreakpoint()

  const {
    inputProps,
    results,
    resultMessage,
    dropDownProps,
    isResultBoxOpen,
    isBackdropApplied,
    close,
    searchTrigger,
  } = useSearch({
    api: api.product.searchData.useMutation(),
    autoClose: true,
    onClose: () => setShow(false),
  })

  useUpdateEffect(() => {
    if (isResultBoxOpen) {
      close()
    }
  }, [isShowing])

  const isDesktop = breakpoint !== "SM"

  if (isDesktop || isShowing) {
    return (
      <>
        <div className="fixed inset-x-0 top-14 z-[100000000] col-span-2 flex flex-1 items-center justify-center md:relative md:top-0 md:max-w-2xl">
          <div className="relative flex w-full items-center justify-center">
            <SearchInput
              inputProps={inputProps}
              searchTrigger={searchTrigger}
              className="bg-white"
              isShowing={false}
            />

            <SearchResults
              searchResults={results}
              isBackdropApplied={isBackdropApplied}
              isResultBoxOpen={isResultBoxOpen}
              className="absolute left-0 top-12 md:top-10"
              dropDownProps={dropDownProps}
              close={close}
              backdrop
              resultMessage={resultMessage}
            />
          </div>
        </div>

        {isBackdropApplied && (
          <div
            className={cn(
              "fixed inset-x-0 top-0 z-[100000] h-[100dvh] w-full",
              {
                "bg-black bg-opacity-40": true,
              },
            )}
            onClick={() => close()}
          ></div>
        )}
      </>
    )
  }

  return null
}

interface SearchInputProps extends React.HTMLAttributes<HTMLElement> {
  inputProps: InputHTMLAttributes<HTMLInputElement>
  searchTrigger: () => void
  isShowing: boolean
}

export function SearchInput({ ...props }: SearchInputProps) {
  const { inputProps, searchTrigger, isShowing } = props

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded",
        {
          "rounded-none": isShowing,
        },
        props.className,
      )}
    >
      <Input
        className={cn(
          "text-13 h-12 rounded focus:border-2 focus:border-secondary md:h-10",
          {
            "border-2": !isShowing,
            "rounded-none border-b": isShowing,
          },
        )}
        placeholder="Search for products and more"
        {...inputProps}
      />

      <div
        className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 transform cursor-pointer items-center justify-center bg-secondary px-3"
        onClick={() => searchTrigger()}
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
      </div>
    </div>
  )
}

interface SearchResultsProps extends React.HTMLAttributes<HTMLElement> {
  searchResults: SearchTerm[]
  dropDownProps: React.HTMLAttributes<HTMLDivElement>
  isResultBoxOpen: boolean
  isBackdropApplied: boolean
  close: () => void
  backdrop: boolean
  resultMessage: string | null
}

function SearchResults({ ...props }: SearchResultsProps) {
  const { searchResults, isResultBoxOpen, dropDownProps, resultMessage } = props

  return (
    <>
      {isResultBoxOpen && (
        <div
          className={cn(
            "z-[1000000000] w-full overflow-hidden rounded border bg-white shadow",
            props.className,
          )}
          {...dropDownProps}
        >
          <ScrollArea className={cn("h-[300px]")}>
            {resultMessage !== null && (
              <div className="px-4 py-8 text-center">{resultMessage}</div>
            )}

            {searchResults.map((a) => (
              <Link
                key={a.slug + Math.random()}
                href={storeNavigations.dynamic.shop.path(a.slug)}
                className="inline-block w-full cursor-pointer border-b px-4 py-2 text-sm hover:bg-zinc-100"
              >
                <span className="flex items-center gap-3">
                  <MagnifyingGlassIcon /> {a.title}
                </span>
              </Link>
            ))}
          </ScrollArea>
        </div>
      )}
    </>
  )
}

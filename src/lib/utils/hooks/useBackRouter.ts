import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export default function useBackRouter() {
  const path = usePathname()

  const pathHistory = usePaths()

  useEffect(() => {
    if (path === "/") {
      return pathHistory.reset()
    }
    pathHistory.setPath(path)
  }, [path])

  const home = pathHistory.paths.find((a) => a === "/")

  const backPath =
    pathHistory.paths.length === 2
      ? pathHistory.paths[0]
      : pathHistory.paths[pathHistory.paths.length - 2]

  const getBackPath = () => {
    if (!home || !backPath) return "/"

    return backPath
  }

  const handleBack = () => pathHistory.removePath(path)

  return { getBackPath, handleBack, path }
}

export type UseBackRouterOutputType = ReturnType<typeof useBackRouter>

interface Store {
  paths: string[]
  setPath: (pathname: string) => void
  removePath: (pathname: string) => void
  reset: () => void
}

export const usePaths = create<Store>()(
  persist(
    (set) => ({
      paths: [],
      setPath: (pathname) =>
        set((state) => ({
          paths: [...state.paths.filter((path) => path !== pathname), pathname],
        })),
      removePath: (pathname) =>
        set((state) => ({
          paths: [...state.paths.filter((path) => path !== pathname)],
        })),
      reset: () =>
        set(() => ({
          paths: ["/"],
        })),
    }),
    {
      name: "paths",
    },
  ),
)

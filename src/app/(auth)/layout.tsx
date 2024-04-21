import "react-loading-skeleton/dist/skeleton.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden transition-all duration-300 md:bg-slate-50">
      <div className="flex min-h-[620px] w-full max-w-xl items-center justify-center p-4 text-center md:rounded md:border md:bg-white md:py-20">
        <div className="mx-auto flex h-full w-full max-w-sm flex-col md:justify-between">
          {children}
        </div>
      </div>
    </main>
  )
}

import Link from "next/link"

interface AuthFooterProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthFooter({ ...props }: AuthFooterProps) {
  const {} = props

  return (
    <footer className="mt-10 flex w-full flex-col gap-4">
      <p className="text-center text-xs font-medium text-muted-foreground">
        By signing in, you agree to{" "}
        <span className=" underline">
          <Link href={"/policy/privacy"}>Privacy policy</Link>
        </span>
      </p>

      <div className="flex w-full items-center justify-center gap-1 text-center text-[10px] text-zinc-600">
        Protected by
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          height={16}
          width={16}
          className="ml-1 fill-orange-500"
        >
          <path d="M407.9 319.9l-230.8-2.9a4.6 4.6 0 0 1 -3.6-1.9 4.6 4.6 0 0 1 -.5-4.1 6.1 6.1 0 0 1 5.4-4.1L411.3 303.9c27.6-1.3 57.5-23.6 68-50.8l13.3-34.5a7.9 7.9 0 0 0 .5-2.9 7.7 7.7 0 0 0 -.2-1.6A151.9 151.9 0 0 0 201.3 198.4 68.1 68.1 0 0 0 94.2 269.6C41.9 271.1 0 313.7 0 366.1a96.1 96.1 0 0 0 1 14 4.5 4.5 0 0 0 4.4 3.9l426.1 .1c0 0 .1 0 .1 0a5.6 5.6 0 0 0 5.3-4l3.3-11.3c3.9-13.4 2.4-25.8-4.1-34.9C430.1 325.4 420.1 320.5 407.9 319.9zM513.9 221.1c-2.1 0-4.3 .1-6.4 .2a3.8 3.8 0 0 0 -3.3 2.7l-9.1 31.2c-3.9 13.4-2.4 25.8 4.1 34.9 6 8.4 16.1 13.3 28.2 13.9l49.2 2.9a4.5 4.5 0 0 1 3.5 1.9 4.6 4.6 0 0 1 .5 4.2 6.2 6.2 0 0 1 -5.4 4.1l-51.1 2.9c-27.8 1.3-57.7 23.6-68.1 50.8l-3.7 9.6a2.7 2.7 0 0 0 2.4 3.7c0 0 .1 0 .1 0h175.9a4.7 4.7 0 0 0 4.5-3.4 124.8 124.8 0 0 0 4.7-34C640 277.3 583.5 221.1 513.9 221.1z" />
        </svg>{" "}
        Cloudflare
      </div>
    </footer>
  )
}

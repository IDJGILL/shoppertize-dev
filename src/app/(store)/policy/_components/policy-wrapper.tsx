export default function PolicyWrapper({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props

  return (
    <main className="[&_h3]:text-md [&_h3]: [&_h4]: mx-auto max-w-3xl px-4 py-20 [&_h3]:mb-2 [&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-sm [&_p]:mb-4 [&_p]:text-sm [&_section]:mb-8">
      {props.children}
    </main>
  )
}

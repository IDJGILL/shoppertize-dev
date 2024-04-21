"use client"

import { toast } from "sonner"

interface OffersSliderProps extends React.HTMLAttributes<HTMLElement> {
  product: Product
}

export default function ProductOffersSlider({ ...props }: OffersSliderProps) {
  const {} = props

  const offers = [
    {
      name: "Get upto 30% Off on order value above ₹5000",
      code: "ORDER100",
      conditions: "",
    },
    {
      name: "Get upto 30% Off on order value above ₹5000",
      code: "NEW200",
      conditions: "",
    },
    {
      name: "Get upto 30% Off on order value above ₹5000",
      code: "FRIDAY20",
      conditions: "",
    },
  ]

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text).then(() => {
      toast.success(`${text} is copied to clipboard.`)
    })
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-secondary stroke-white"
        >
          <path
            d="m3.989 14.66-1.52-1.52c-.62-.62-.62-1.64 0-2.26l1.52-1.52c.26-.26.47-.77.47-1.13V6.08c0-.88.72-1.6 1.6-1.6h2.15c.36 0 .87-.21 1.13-.47l1.52-1.52c.62-.62 1.64-.62 2.26 0l1.52 1.52c.26.26.77.47 1.13.47h2.15c.88 0 1.6.72 1.6 1.6v2.15c0 .36.21.87.47 1.13l1.52 1.52c.62.62.62 1.64 0 2.26l-1.52 1.52c-.26.26-.47.77-.47 1.13v2.15c0 .88-.72 1.6-1.6 1.6h-2.15c-.36 0-.87.21-1.13.47l-1.52 1.52c-.62.62-1.64.62-2.26 0l-1.52-1.52c-.26-.26-.77-.47-1.13-.47h-2.15c-.88 0-1.6-.72-1.6-1.6v-2.15c0-.37-.21-.88-.47-1.13ZM9 15l6-6"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M14.495 14.5h.009M9.495 9.5h.008"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>

        <h3 className="font-medium">Offers</h3>
      </div>

      <div className="grid grid-cols-3 space-x-4">
        {offers.map((offer) => (
          <div key={offer.code} className="rounded-md border p-2 shadow">
            <div>
              <div className="text-sm font-medium">{offer.code}</div>
              <div className="mb-2 text-xs text-muted-foreground">
                {offer.name}
              </div>

              <div
                className="link text-xs"
                onClick={() => handleCopy(offer.code)}
              >
                {"Grab it >"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

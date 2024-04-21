export default function PrivacyContact({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props

  return (
    <div className="mt-14 rounded border border-primary p-8">
      <h4 className="!mt-0 !text-xl text-primary">
        Shopper<span className="text-secondary">tize</span> Inc.
      </h4>

      <p className="!mb-0">
        <strong>Executive:</strong> Tarun Gupta
        <br />
        <strong>Email: </strong> tarun@shoppertize.in
        <br />
        <strong>Address: </strong> Ground, Plot No. 105, Sector - 106, Near
        Vijaya Bank, Village Babupur, Gurgaon, Haryana, 122006,
      </p>
    </div>
  )
}

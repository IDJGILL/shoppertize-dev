import React from "react"
import PolicyWrapper from "../_components/policy-wrapper"
import PrivacyContact from "../_components/privacy-contact"

export default function ShippingPage() {
  return (
    <PolicyWrapper>
      <section>
        <h1 className="mb-8 text-center text-2xl ">Shipping Policy</h1>

        <h3>1. Order Processing:</h3>
        <p>
          a. Within 1 to 2 business days, we process all orders. The following
          business day will be used to process orders placed on weekends or
          holidays.
        </p>
      </section>

      <section>
        <h3>2. Shipping Methods:</h3>

        <p>
          a. Standard and expedited shipping options are among the many that we
          provide. Delivery schedules and shipping prices are determined by the
          method and location chosen.
        </p>
      </section>

      <section>
        <h3>3. Shipping Locations:</h3>

        <p>
          a. At this time, we ship to addresses in 4 to 5 days. To prevent
          delivery problems, please make sure the shipping address you enter
          during checkout is correct.
        </p>
      </section>

      <section>
        <h3>4. Order Tracking:</h3>

        <p>
          a. You will receive a shipping confirmation email with a tracking
          number as soon as your order ships. With the tracking details
          supplied, you can monitor the progress of your package.
        </p>
      </section>

      <section>
        <h3>5. Shipping Costs:</h3>

        <p>
          a. The weight of your order, the shipping option you choose, and the
          destination are taken into account when calculating the shipping
          costs. When you check out, the entire shipping cost will be shown.
        </p>
      </section>

      <section>
        <h2>6. Free Shipping:</h2>

        <p>
          a. For qualifying orders, we might run promotions with free shipping.
          When applicable, promotional periods will be used to provide details
          about eligibility for free shipping.
        </p>
      </section>

      <section>
        <h3>7. Customs and Import Duties:</h3>

        <p>
          a. Customs and import duties are the {`recipient's`} responsibility
          and may apply to orders coming from overseas. Please check with your
          local customs office for more information as customs policies differ
          by country.
        </p>
      </section>

      <section>
        <h3>8. Delivery Delays:</h3>

        <p>
          a. Although we work hard to deliver orders on schedule, there are
          times when delivery times are affected by outside variables like bad
          weather, delays in customs clearance, and carrier delays. We are
          grateful for your understanding in these circumstances.
        </p>
      </section>

      <section>
        <h3>9. Shipping Restrictions:</h3>

        <p>
          a. Shipping restrictions based on product size, weight, or destination
          may apply to some products. For information on any applicable shipping
          restrictions, please refer to the product description.
        </p>
      </section>

      <section>
        <p>
          By making a purchase from Shoppertize, you agree to and accept the
          terms of our Shipping Policy. This policy is effective as of
          04-12-2023 and is subject to change without notice.
        </p>
      </section>

      <PrivacyContact />
    </PolicyWrapper>
  )
}

import React from "react"
import PolicyWrapper from "../_components/policy-wrapper"
import Link from "next/link"
import PrivacyContact from "../_components/privacy-contact"

export default function TermsPage() {
  return (
    <PolicyWrapper>
      <section>
        <h1 className="mb-8 text-center text-2xl ">Terms and Conditions</h1>

        <h3>1. Acceptance of Terms:</h3>
        <p>
          Through your use of {`Shoppertize's`} services{" "}
          {`(referred to as "we,"
          "us," or "our")`}
          , you consent to follow and be bound by these terms and conditions of
          use. Please do not use our website if you do not agree to these terms.
        </p>
      </section>

      <section>
        <h3>3. User Account:</h3>

        <p>
          When you register for an account on Shoppertize, you take full
          responsibility for all activities that happen under your account,
          including keeping it secure. You promise to fill out the registration
          form completely and accurately.
        </p>
      </section>

      <section>
        <h3>4. Product Information:</h3>
        <p>
          We do everything in our power to present accurate and current product
          information. On the other hand, we make no guarantees regarding the
          completeness, accuracy, or dependability of the {`site's`} content,
          including product descriptions and prices.
        </p>
      </section>

      <section>
        <h3>5. Ordering and Payment:</h3>
        <p>
          You acknowledge that the price listed for the goods or services,
          including any applicable taxes and shipping costs, is what you will
          pay when you place an order on our website. Payment gateways from
          third parties are used to securely process payments.
        </p>
      </section>

      <section>
        <h3>6. Shipping and Delivery:</h3>

        <p>
          Our goal is to quickly process and ship orders. Delivery schedules,
          though, might differ. Delivery delays brought on by uncontrollable
          circumstances are not our responsibility. Please refer to our{" "}
          <Link href="/" className="link">
            Shipping Policy
          </Link>{" "}
          for more details.
        </p>
      </section>

      <section>
        <h3>7. Returns and Refunds:</h3>
        <p>
          Our website contains information about our return and refund policy.
          Please read over{" "}
          <Link href="/" className="link">
            return, refund and exchange
          </Link>{" "}
          policy before putting money on the table.
        </p>
      </section>

      <section>
        <h3>8. Prohibited Activities:</h3>

        <p>
          You agree not to use our website for any illegal or forbidden
          purposes. This involves, but is not restricted to, content
          distribution that is harmful, unauthorized access, and infringement on
          intellectual property rights.
        </p>
      </section>

      <section>
        <h3>9. Intellectual Property:</h3>

        <p>
          Shoppertize owns all of the content on its website, including all
          text, photos, trademarks, and logos. This content is shielded by laws
          pertaining to intellectual property. Without our express written
          consent, you are not permitted to use, copy, or distribute our
          content.
        </p>
      </section>

      <section>
        <h3>10. Limitation of Liability:</h3>

        <p>
          Shoppertize disclaims all liability for any damages—direct, indirect,
          incidental, special, or consequential—that result from using our
          website or its products or from anything related to them.
        </p>
      </section>

      <section>
        <h4>11. Governing Law:</h4>

        <p>
          The laws of India shall apply to these Terms and Conditions. The
          courts in Haryana shall have exclusive jurisdiction over any disputes
          arising out of these terms.
        </p>
      </section>

      <section>
        <h3>12. Changes to Terms:</h3>

        <p>
          We reserve the right to update or modify these Terms and Conditions at
          any time. Changes will be effective immediately upon posting to the
          website.
        </p>
      </section>

      <PrivacyContact />
    </PolicyWrapper>
  )
}

import React from "react"
import PolicyWrapper from "../_components/policy-wrapper"
import PrivacyContact from "../_components/privacy-contact"

export default function ReturnExchangePage() {
  return (
    <PolicyWrapper>
      <section>
        <h1 className="mb-8 text-center text-2xl ">
          Return, Exchange, and Refund Policy
        </h1>

        <h3>1. Returns:</h3>
        <p>
          a. We aim for your satisfaction with every Shoppertize purchase to be
          flawless. Within 7 days of receiving your order, you may return the
          item(s) if {`you're`} not happy for any reason.
        </p>

        <p>
          b. To initiate a return, please head over to your order details
          section in <strong>My Account {`>`} My Orders</strong>. Products must
          be returned unused, in their original packaging, and in their original
          condition.
        </p>

        <p>
          c. We are unable to offer a pick-up service in some areas. You may,
          however, ship your item yourself using any courier option available in
          your area.
        </p>
      </section>

      <section>
        <h3>2. Exchanges:</h3>
        <p>
          a. We will be happy to replace any defective or damaged items you
          receive with a new one after receiving the item, please get in touch
          with our customer service team to report the problem and set up an
          exchange.
        </p>

        <p>
          b. Exchanges depend on the availability of the product. In the event
          that the item is out of stock, we will provide a credit or an
          appropriate substitute.
        </p>
      </section>

      <section>
        <h3>3. Refunds:</h3>
        <p>
          a. We strive to process refunds within 24 hours of receiving the
          returned item. We appreciate your patience, but please be aware that
          it could take up to 4 or 5 days for the refund to appear in the
          original payment method used for the purchase.
        </p>

        <p>
          b. The Shoppers Wallet is the preferred method for speedier payments
          and refunds. Using the Shoppers Wallet guarantees a quicker processing
          time, so you can get your refund in a matter of hours.
        </p>

        {/* <p>
          c. There are no refunds for shipping charges. The cost of return
          shipping will be subtracted from your refund if you are eligible for
          one.
        </p> */}
      </section>

      <section>
        <h3>4. Non-Returnable Items:</h3>
        <p>
          a. Not every item can be returned. Before you buy, please read the
          product description.
        </p>
      </section>

      <section>
        <h3>6. Cancellation of Orders:</h3>
        <p>
          a. Orders may be cancelled before shipping and during the product
          processing phase. please head over to your order details section in{" "}
          <strong>My Account {`>`} My Orders</strong>.
        </p>
      </section>

      <section>
        <h3>8. Contact Information:</h3>

        <p>
          a. Please email us at care@shopprtize.in with any queries or worries
          you may have regarding our return, exchange, and refund policy.
        </p>

        <p>
          You accept and agree to the terms of our return, exchange, and refund
          policy by using Shoppertize to make purchases. This policy is subject
          to change without notice and is in effect as of 04-12-2023.
        </p>
      </section>

      <PrivacyContact />
    </PolicyWrapper>
  )
}

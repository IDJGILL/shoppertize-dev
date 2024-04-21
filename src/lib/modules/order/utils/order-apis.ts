import { type AuthedTrpcContext } from "~/lib/trpc/trpc-context"
import {
  type InfiniteOrdersSchemaProps,
  type PaymentMethodSchemaProps,
} from "./order-schemas"
import { getUserBy, getAuthTokensByUsername } from "../../auth/auth-router"
import { calculateCodCharges } from "~/lib/utils/functions/calculate-cod-charges"
import {
  creditWallet,
  debitWallet,
  getWalletBalance,
} from "~/lib/server/api/store/wallet/wallet.modules"
import type {
  Address,
  CalculatePaymentMethod,
  CreateOrderInput,
  FeeLine,
  GetDataForOrder,
  InfiniteOrder,
  MetaData,
  PriceCalculatorProps,
  SingleOrder,
  UpdatePostOrderMetaInput,
} from "./order-types"
import { adminQueryV2, userQueryV2 } from "~/lib/server/access/graphql"
import {
  GET_INFINITE_ORDERS,
  GET_SINGLE_ORDER,
  SESSION_QUERY_FOR_ORDER,
  UPDATE_POST_ORDER_META,
} from "./order-gql"
import {
  sessionHelper,
  userMetaHelper,
} from "../../checkout/utils/checkout-apis"
import { createPayPageURI } from "~/lib/server/api/store/payment/phonepe/phonepe.modules"
import { GET_ITEMS_FOR_VALIDATION } from "~/lib/server/api/store/checkout/checkout.gql"
import type {
  CartLineItem,
  SessionCartTotals,
} from "../../checkout/utils/checkout-types"
import { woocommerce } from "~/lib/server/access/woocommerce"
import metaFinder from "~/lib/utils/functions/meta-finder"
import { getBaseUrl } from "~/lib/utils/functions/trpc"
import { nanoid } from "nanoid"
import { base64 } from "~/lib/utils/functions/base64"
import { createOrderConfirmationToken } from "~/lib/utils/functions/jwt"
import { env } from "~/env.mjs"
import { type RevalidateSchemaProps } from "~/lib/server/api/store/product/product.dtos"
import { calculateCouponDiscount } from "~/lib/server/api/store/cart/cart.modules"
import { decodeBase64Id } from "~/lib/utils/functions/decodeBase64Id"
import {
  bulkNimbusOrderTracking,
  singleNimbusOrderTracing,
} from "../../courier/courier-apis"
import { createAction } from "~/lib/utils/functions/create-action"

export const placeOrder = async (
  props: AuthedTrpcContext<PaymentMethodSchemaProps>,
) => {
  return await createAction<string, "pay_page">(async (success, error) => {
    const {
      session: { user, authToken },
    } = props

    const {
      cart,
      customer,
      isWalletApplied,
      walletBalance,
      paymentMethod,
      appliedCoupon,
      cartTotals,
      metaData,
      sessionData,
      productSlugs,
    } = await getDataForOrder({
      requestedMethod: props.input,
      authToken,
    })

    await orderGuard(
      cart,
      paymentMethod,
      cartTotals,
      walletBalance,
      isWalletApplied,
    )

    if (props.input === "ONLINE") {
      const totalPayable = calculateTotalPayable({
        paymentMethod,
        shippingCharges: 0,
        isWalletApplied,
        email: user.email,
        walletBalance,
        appliedCoupon,
        cartTotals,
      })

      const paymentURI = await createPayPageURI({
        customerId: customer.databaseId,
        authToken,
        totalPayable,
      })

      return success({
        data: paymentURI,
        action: "pay_page",
        message: "Pay page created",
      })
    }

    const orderRequest = await createOrder({
      cart,
      transactionReferenceId: "",
      customerId: customer.databaseId,
      shipping: customer.shipping,
      billing: customer.billing,
      paymentMethod,
      email: customer.email,
      cartTotals,
      shippingCharges: 0,
      isWalletApplied,
      walletBalance,
      appliedCoupon,
      metaData,
      sessionData,
      authToken,
      productSlugs,
    })

    if (!!!orderRequest?.token) return error({ action: "none" })

    return success({
      action: "none",
      data: orderRequest.token,
      message: "Order placed",
    })
  })
}

export const placeOrderByWebhook = async (payload: PhonePePaymentStatus) => {
  const customerId = base64.parse<string>({
    base64Id: payload.data.merchantTransactionId,
    index: 1,
  })

  const session = await getUserData(customerId)

  if (!session) return // todo

  const {
    cart,
    customer,
    isWalletApplied,
    walletBalance,
    paymentMethod,
    appliedCoupon,
    cartTotals,
    metaData,
    sessionData,
    productSlugs,
  } = await getDataForOrder({
    requestedMethod: "ONLINE",
    authToken: session.authToken,
  })

  const isOrderCreated = await createOrder({
    cart,
    transactionReferenceId: payload.data.merchantTransactionId,
    customerId: customer.databaseId,
    shipping: customer.shipping,
    billing: customer.billing,
    paymentMethod,
    email: customer.email,
    cartTotals,
    shippingCharges: 0,
    isWalletApplied,
    walletBalance,
    appliedCoupon,
    metaData,
    sessionData,
    productSlugs,
    authToken: session.authToken,
  })

  if (!isOrderCreated) {
    // Send email to admin
  }

  return true
}

export const getInfiniteOrders = async (
  props: AuthedTrpcContext<InfiniteOrdersSchemaProps>,
) => {
  const {
    session,
    input: { cursor },
  } = props

  const ordersResponse = await adminQueryV2<{
    orders: Infinite<InfiniteOrder>
  }>({
    query: GET_INFINITE_ORDERS,
    variables: {
      after: cursor,
      customerId: +(session?.user.id ?? ""),
    },
  })

  const orders = ordersResponse.data.orders.edges.map((item) => item.node)

  let nextCursor: string | undefined = undefined

  if (ordersResponse.data.orders.pageInfo.hasNextPage) {
    const lastItem =
      ordersResponse.data.orders.edges[
        ordersResponse.data.orders.edges.length - 1
      ]

    nextCursor = lastItem ? lastItem.cursor : undefined
  } else {
    nextCursor = undefined
  }

  const orderAwbArray = orders.reduce<string[]>((acc, order) => {
    if (order.status === "READYTODISPATCH" || order.status === "INTRANSIT") {
      const awb = metaFinder.safeParse<string>({
        key: "AWB Number",
        metaData: order.metaData,
      })

      if (!!!awb) return acc

      acc.push(awb)
    }

    return acc
  }, [])

  const bulkTracking = await bulkNimbusOrderTracking(orderAwbArray)

  const ordersData: InfiniteOrder[] = orders.map((a) => ({
    ...a,
    tracking: bulkTracking.find(
      (b) =>
        metaFinder.safeParse({
          key: "AWB Number",
          metaData: a.metaData,
        }) === b.awb_number,
    ),
  }))

  return {
    nextCursor,
    data: ordersData,
    found: ordersResponse.data.orders.found,
    hasNextPage: ordersResponse.data.orders.pageInfo.hasNextPage,
    hasPreviousPage: ordersResponse.data.orders.pageInfo.hasPreviousPage,
  }
}

export const getOrderById = async (id: string) => {
  const orderId = decodeBase64Id(decodeURIComponent(id))

  const orderResponse = await adminQueryV2<{ order: SingleOrder }>({
    query: GET_SINGLE_ORDER,
    variables: {
      id: orderId,
    },
  })

  const order = orderResponse.data.order

  if (order.status === "READYTODISPATCH" || order.status === "INTRANSIT") {
    const awb = metaFinder.parse<string>({
      key: "AWB Number",
      metaData: order.metaData,
    })

    const tracking = await singleNimbusOrderTracing(awb)

    return {
      ...order,
      tracking: tracking ?? undefined,
    }
  }

  return order
}

async function createOrder(props: CreateOrderInput) {
  try {
    const feeLines = calculateFeeLines({
      email: props.email,
      paymentMethod: props.paymentMethod,
      cartTotals: props.cartTotals,
      shippingCharges: props.shippingCharges,
      isWalletApplied: props.isWalletApplied,
      walletBalance: props.walletBalance,
      appliedCoupon: props.appliedCoupon,
    })

    const isGSTBilling = !!props?.billing?.company

    const gstBillingAddress = {
      first_name: props?.billing?.firstName ?? "",
      company: props?.billing?.company ?? "",
      address_1: props?.billing?.address1 ?? "",
      address_2: props?.billing?.address2 ?? "",
      city: props?.billing?.city ?? "",
      state: props?.billing?.state ?? "",
      postcode: props?.billing?.postcode ?? "",
      country: props?.billing?.country ?? "",
      phone: props?.billing?.phone ?? "",
    }

    const shippingAddress = {
      first_name: props.shipping.firstName,
      last_name: props.shipping.lastName,
      address_1: props.shipping.address1,
      address_2: props.shipping.address2,
      city: props.shipping.city,
      state: props.shipping.state,
      postcode: props.shipping.postcode,
      country: props.shipping.country,
      email: props.email,
      phone: props.shipping.phone,
    }

    let status = "processing"

    let paymentMethod = props.paymentMethod === "COD" ? "cod" : "other_payment"

    const walletAmount = Math.min(
      +props.cartTotals.subtotal,
      props.walletBalance,
    )

    if (props.isWalletApplied) {
      const isDebited = await debitWallet(props.email, walletAmount)

      if (!isDebited) {
        status = "pending"
        paymentMethod = "cod"
      }
    }

    const order = await woocommerce<{ id: number }>(
      "POST",
      "orders",
      {
        customer_id: props.customerId,
        status: status,
        payment_method: paymentMethod,
        set_paid: props.paymentMethod === "ONLINE",
        billing: isGSTBilling ? gstBillingAddress : shippingAddress,
        shipping: shippingAddress,
        line_items: props.cart,
        fee_lines: feeLines,
        shipping_lines: [],
        coupon_lines: [],
        meta_data: [
          {
            key: "transaction_reference_id",
            value: props.transactionReferenceId,
          },
        ],
      },
      "no-cache",
    ).catch(() => null)

    if (!!!order && props.isWalletApplied) {
      await creditWallet(props.email, walletAmount)
    }

    if (!order) return null

    await updatePostOrderMeta({
      metaData: props.metaData,
      sessionData: props.sessionData,
      authToken: props.authToken,
    })

    void revalidateProducts(props.productSlugs).catch(() => null)

    const uniqueId = nanoid()

    const transactionReferenceId = base64.create([
      uniqueId,
      props.customerId,
      order.id.toString(),
    ])

    const token = await createOrderConfirmationToken({
      id: transactionReferenceId,
      method: props.paymentMethod,
    })

    return { token }
  } catch {
    // Todo
  }
}

export const revalidateProducts = async (slugs: string[]) => {
  await fetch(`${getBaseUrl()}/api/revalidate`, {
    headers: {
      "Content-Type": "application/json",
      "X-SECRET": env.REVALIDATION_SECRET,
    },
    method: "POST",
    body: JSON.stringify([
      {
        type: "TAG",
        items: slugs,
      },
    ] satisfies RevalidateSchemaProps),
  })
}

async function updatePostOrderMeta(props: UpdatePostOrderMetaInput) {
  try {
    const usedCoupons = userMetaHelper.usedCoupons.from(props.metaData)

    const appliedCoupon = sessionHelper.appliedCoupon.from(props.metaData)

    const updatedMetaData: MetaData[] = [
      metaFinder.create.single({
        key: "verification",
        value: null,
      }),
    ]

    const updatedSessionData: MetaData[] = []

    if (appliedCoupon) {
      const newUsedCoupon = {
        code: appliedCoupon.code,
        discountAmount: appliedCoupon.amount,
        date: Date.now().toString(),
      }

      updatedMetaData.push(
        userMetaHelper.usedCoupons.add({
          old: usedCoupons && usedCoupons.length > 0 ? usedCoupons : [],
          new: newUsedCoupon,
        }),
      )
    }

    updatedSessionData.push(
      metaFinder.create.single({
        key: "applied_wallet",
        value: null,
      }),
    )

    updatedSessionData.push(
      metaFinder.create.single({
        key: "applied_coupon",
        value: null,
      }),
    )

    await userQueryV2({
      query: UPDATE_POST_ORDER_META,
      variables: {
        metaData: updatedMetaData,
        sessionData: updatedSessionData,
      },
      authToken: props.authToken,
    })
  } catch {
    return null
  }
}

async function orderGuard(
  records: CartLineItem[],
  method: PaymentMethod,
  cartTotals: SessionCartTotals,
  walletBalance: number,
  isWalletApplied: boolean,
) {
  const productsResponse = await adminQueryV2<{
    products: {
      nodes: {
        type: ProductType
        databaseId: string
        stockStatus: StockStatus
        stockQuantity: number
        productSettings: {
          hasCashOnDelivery: true | null
          hasReturnExchange: true | null
        }
        variations?: {
          nodes: {
            databaseId: string
            stockStatus: StockStatus
            stockQuantity: number
          }[]
        }
      }[]
    }
  }>({
    query: GET_ITEMS_FOR_VALIDATION,
    variables: { include: records.map((item) => item.product_id) },
  })

  const hasCodDisabledItems = productsResponse.data.products.nodes.some(
    (a) => a.productSettings.hasCashOnDelivery === null,
  )

  const simpleProducts = productsResponse.data.products.nodes.filter(
    (item) => item.type === "SIMPLE",
  )

  const variationProducts = productsResponse.data.products.nodes
    .filter((a) => a.type === "VARIABLE")
    .flatMap((b) => b.variations?.nodes)
    .filter(
      (c) =>
        !!records
          .map((d) => d.variation_id)
          .find((e) => e === +(c?.databaseId ?? 0)),
    )

  const hasOutOfStockSimpleItems = simpleProducts.some(
    (a) => a.stockStatus === "OUT_OF_STOCK" || a.stockQuantity === 0,
  )

  const hasOverQuantityItems = simpleProducts.some(
    (a) =>
      (records.find((b) => b.product_id === +a.databaseId)?.quantity ?? 0) >
      a.stockQuantity,
  )

  const hasOutOfStockVariableItems = variationProducts.some(
    (a) => a?.stockStatus === "OUT_OF_STOCK" || a?.stockQuantity === 0,
  )

  const hasOverQuantityVariableItems = variationProducts.some(
    (a) =>
      (records.find((b) => b.variation_id === +(a?.databaseId ?? 0))
        ?.quantity ?? 0) > (a?.stockQuantity ?? 0),
  )

  if (isWalletApplied && walletBalance < +cartTotals.total) throw new Error()

  /* All items must have cod available if method is cod */
  if (method === "COD" && hasCodDisabledItems) throw new Error()

  /* The items have quantity that are not in stock */
  if (hasOverQuantityItems || hasOverQuantityVariableItems) throw new Error()

  /* The items that have been out of stock */
  if (hasOutOfStockSimpleItems || hasOutOfStockVariableItems) throw new Error()
}

async function getDataForOrder(props: GetDataForOrder) {
  const customerResponse = await userQueryV2<{
    customer: {
      databaseId: string
      email: string
      session: MetaData[]
      metaData: MetaData[]
      shipping: Address
      billing: Address
    }
    cart: {
      contents: {
        nodes: {
          product: {
            node: {
              slug: string
            }
          }
        }[]
      }
      availableShippingMethods: ShippingMethod[]
    }
  }>({
    query: SESSION_QUERY_FOR_ORDER,
    variables: {
      keys: ["used_coupons"],
    },
    authToken: props.authToken,
  })

  const customer = customerResponse.data.customer

  const metaData = customerResponse.data.customer.metaData

  const sessionData = customerResponse.data.customer.session

  const cart = sessionHelper.cart.from(sessionData)

  const cartTotals = sessionHelper.cartTotals.from(sessionData)

  const isWalletApplied = sessionHelper.appliedWallet.from(sessionData)

  const appliedCoupon = sessionHelper.appliedCoupon.from(sessionData)

  const walletBalance = await getWalletBalance(customer.email)

  const productSlugs = customerResponse.data.cart.contents.nodes.map(
    (a) => a.product.node.slug,
  )

  const paymentMethod = calculatePaymentMethod({
    requestedMethod: props.requestedMethod,
    walletBalance,
    isWalletApplied,
    total: +cartTotals.total,
  })

  return {
    cart,
    customer,
    cartTotals,
    isWalletApplied,
    walletBalance,
    paymentMethod,
    appliedCoupon,
    metaData,
    sessionData,
    productSlugs,
  }
}

function calculatePaymentMethod(input: CalculatePaymentMethod) {
  let paymentMethod = input.requestedMethod

  if (input.isWalletApplied && +input.total > input.walletBalance) {
    paymentMethod = "ONLINE"
  }

  if (input.isWalletApplied && +input.total <= input.walletBalance) {
    paymentMethod = "WALLET"
  }

  return paymentMethod
}

function calculateTotalPayable(props: PriceCalculatorProps) {
  // Fix: woocommerce/includes/class-wc-order-item-fee.php
  // At line: 99
  // value: set_taxes( false );

  const feeLines = calculateFeeLines(props)

  const totalPayable = feeLines.reduce((acc, line) => {
    return acc + +line.total
  }, +props.cartTotals.subtotal + props.cartTotals.subtotal_tax)

  return totalPayable
}

function calculateFeeLines(props: PriceCalculatorProps) {
  const lines: FeeLine[] = [] as FeeLine[]

  if (props.paymentMethod === "COD") {
    const codChanges = calculateCodCharges(+props.cartTotals.subtotal)

    lines.push({
      name: "COD Fee",
      total: codChanges.toString(),
      tax_status: "none",
    })
  }

  lines.push({
    name: "Shipping",
    total: props.shippingCharges.toString(),
    tax_status: "none",
  })

  const appliedCoupon = calculateCouponDiscount(
    props.appliedCoupon,
    +props.cartTotals.total,
  )

  if (appliedCoupon) {
    lines.push({
      name: "Coupon",
      total: "-" + appliedCoupon.couponDiscount.toString(),
      tax_status: "none",
    })
  }

  if (props.isWalletApplied && props.paymentMethod !== "COD") {
    const appliedWalletBalance = Math.min(
      props.walletBalance,
      +props.cartTotals.subtotal,
    )

    if (props.isWalletApplied && props.walletBalance > 0) {
      lines.push({
        name: "Wallet",
        total: "-" + appliedWalletBalance.toString(),
        tax_status: "none",
      })
    }
  }

  return lines
}

async function getUserData(id: string) {
  const user = await getUserBy({ id: id, idType: "DATABASE_ID" })

  if (!user) return null

  const userSession = await getAuthTokensByUsername(user.email)

  if (!userSession.success) return null

  return userSession.data
}

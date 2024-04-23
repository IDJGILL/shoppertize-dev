export type PhonePePayPagePayload = {
  merchantTransactionId: string
  merchantUserId: string
  amount: number
  redirectUrl: string
  redirectMode: "REDIRECT" | "POST"
  callbackUrl: string
  merchantId: string
  paymentInstrument: {
    type: "PAY_PAGE"
  }
}

export type PaymentMethod = "COD" | "ONLINE" | "WALLET"

export type PhonePePayPageType = {
  success: boolean
  code: string
  message: string
  data: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse: {
      type: string
      redirectInfo: {
        url: string
        method: string
      }
    }
  }
}

export type PhonePeCallbackResponse = {
  success: boolean
  code: PhonePePaymentStatusEnum
  message: string
  data: PhonePePayPagePayload
}

export type PhonePePaymentStatus = {
  success: boolean
  code: PhonePePaymentStatusEnum
  message: string
  data: {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: string
    responseCode: string
    paymentInstrument: {
      type: "UPI" | "CARD" | "NETBANKING"
    }
  }
}

export type PhonePePaymentStatusEnum = "PAYMENT_SUCCESS" | "PAYMENT_ERROR" | "PAYMENT_PENDING" | "PAYMENT_DECLINED"

export type WalletTransaction = Pick<WalletData, "amount" | "balance" | "date" | "details" | "transaction_id" | "type">

export type WalletData = {
  transaction_id: string
  blog_id: string
  user_id: string
  type: "credit" | "debit"
  amount: string
  balance: string
  currency: string
  details: string
  created_by: string
  deleted: string
  date: string
  meta: []
}

export type WalletBalance = {
  amount: number
  currency: string
}

export type PaymentOption = {
  type: PaymentMethod
  label: string
  description: string
  isEligible: boolean
  charges?: number
}

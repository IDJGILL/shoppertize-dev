export type NimbusTracking = NimbusTrackingFailed | NimbusTrackingSuccess

export type NimbusTrackingFailed = { status: false; message: string }

export type NimbusTrackingSuccess = {
  status: true
  data: {
    id: string
    order_id: string
    order_number: string
    created: string
    edd: string
    pickup_date: string
    rto_initiate_date: string
    delivered_date: string
    shipped_date: string
    awb_number: string
    rto_awb: string
    courier_id: string
    courier_name: string
    warehouse_id: string
    rto_warehouse_id: string
    status: string
    event_time: string
    rto_status: string
    shipment_info: string
    payment_type: "prepaid" | "cod"
    history: NimbusTrackingHistory[]
  }
}

export type NimbusTrackingHistory = {
  status_code: NimbusTrackingStatusCode
  location: string
  event_time: string
  message: string
}

export type NimbusTrackingStatusCode = "PP" | "IT" | "EX" | "OFD" | "DL" | "RT" | "RT-IT" | "RT-DL"

export type NimbusCourierServiceability = {
  origin: number
  destination: number
  payment_type: PaymentType
}

export type NimbusCourierServiceabilityResponse = {
  id: string
  name: string
  freight_charges: number
  cod_charges: number
  total_charges: number
  edd: string
  min_weight: number
  chargeable_weight: number
}[]

export type NimbusShipmentTracking = {
  id: string
}

type PaymentType = "cod" | "prepaid"

export type NimbusAuthData = { status: false; message: string } | { status: true; data: string }
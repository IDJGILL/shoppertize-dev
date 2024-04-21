import { type WrapTRPCSuccess } from "~/lib/trpc/trpc-instance"

export type CourierMethods = {
  pincode: {
    /**
     * Gets Pincode details based on auth status.
     * @throws `BAD_REQUEST` "Please a pincode to get estimated delivery date.".
     */
    get: (props: { authToken: string | null }) => Promise<
      WrapTRPCSuccess<
        {
          pincode: string
          edd: string
        },
        "none"
      >
    >

    /**
     * Sets pincode to cookie store and fetches estimated delivery date.
     * @throws `BAD_REQUEST` This pincode is not serviceable at this moment.
     */
    set: (props: {
      pincode: string
    }) => Promise<WrapTRPCSuccess<string, "none">>

    /**
     * Fetches estimated delivery date (EDD) from courier partner.
     * @throws `BAD_REQUEST` This pincode is not serviceable at this moment.
     */
    fetchEdd: (props: {
      pincode: string
    }) => Promise<WrapTRPCSuccess<string, "none">>

    /**
     * Checks pincode serviceability.
     * @throws `BAD_REQUEST` This pincode is not serviceable at this moment.
     */
    checkService: (props: { pincode: string }) => Promise<
      WrapTRPCSuccess<
        {
          city: string
          state: string
        },
        "none"
      >
    >
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export type CourierPartner = {
  id: string
  name: string
  freight_charges: number
  cod_charges: number
  total_charges: number
  edd: string
  min_weight: number
  chargeable_weight: number
  reverse_qc: boolean
  reverse: boolean
}

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

export type NimbusTrackingStatusCode =
  | "PP"
  | "IT"
  | "EX"
  | "OFD"
  | "DL"
  | "RT"
  | "RT-IT"
  | "RT-DL"

export type TrackingStatus = NimbusTrackingStatusCode

export type PincodeDetails = {
  available_courier_companies: {
    city: string
    cod: number
    etd: string
    postcode: string
    state: string
  }[]
}

export type PincodeDetailsError = {
  message: string
  status: number
}

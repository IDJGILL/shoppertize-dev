import { address } from "./address/utils/address-methods"
import { cart } from "./cart/cart-methods"

/**
 * The $ sign holds all the server-side business logic that powers the framework.
 * Each named exported objects holds methods containing multiple abstracted functions
 * to increase maintainability, productivity and reduced bugs. These Methods must be called within the server.
 *
 * @version 1.0
 * @deprecated
 */
export const $ = { address, cart } as const

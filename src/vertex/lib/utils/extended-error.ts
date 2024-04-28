import { type Status } from "../server/server-types"

/**
 * Represents an error specific to the application.
 * @param {string} [props.message="Something went wrong, Please try again."] - The error message.
 * @param {Status} props.code - The status code of the error.
 *
 * @extends Error
 */
export class ExtendedError extends Error {
  code: Status

  constructor(props: { message?: string; code: Status }) {
    super(props.message ?? "Something went wrong, Please try again.")
    this.code = props.code

    Object.setPrototypeOf(this, ExtendedError.prototype)
  }
}

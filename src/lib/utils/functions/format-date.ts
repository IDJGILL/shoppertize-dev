import moment from "moment"

export const formatDate = (options: { date: string; format?: string }) => {
  return moment(options.date).format(options.format ?? "MMMM Do YYYY, h:mm a")
}

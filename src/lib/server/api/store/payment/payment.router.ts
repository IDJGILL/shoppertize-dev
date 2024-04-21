import { createTRPCRouter } from "~/lib/trpc/trpc-instance"
import { phonepeRouter } from "./phonepe/phonepe.router"

export const paymentRouter = createTRPCRouter({
  phonepe: phonepeRouter,
})

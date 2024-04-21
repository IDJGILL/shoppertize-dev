import appConfig from "app.config"

export const calculateCodCharges = (total: number): number => {
  const codChanges =
    appConfig.payment.codCharges.type === "percentage"
      ? (appConfig.payment.codCharges.amount / 100) * total
      : appConfig.payment.codCharges.amount

  return Math.round(codChanges)
}

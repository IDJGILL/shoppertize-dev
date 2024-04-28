import fs from "fs"
import path from "path"
import { redisClient } from "../redis/redis-client"

const csvFilePath = path.join(process.cwd(), "pincode-list.csv")

export async function seed() {
  const csvData = await fs.promises.readFile(csvFilePath, "utf-8")

  const rows = csvData.split("\r\n")

  const data = {} as Record<string, string>

  const dataSets = rows.slice(1)

  //   eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < dataSets.length; i++) {
    const column = dataSets[i]?.split(",") ?? []

    const state = column[2] ?? ""

    const city = column[1] ?? ""

    data[column[0] ?? ""] = `${city}::${state}`
  }

  await redisClient.hset("postcodes", data)

  //   await redisClient.del("postcodes")

  return data
}

import { Redis } from "@upstash/redis"
import { env } from "~/env.mjs"

console.log(env.UPSTASH_REDIS_REST_URL)

export const redisClient = Redis.fromEnv()

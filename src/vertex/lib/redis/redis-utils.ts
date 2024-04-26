import { nanoid } from "nanoid"
import { redisClient } from "./redis-client"
import { ExtendedError } from "~/vertex/utils/extended-error"
import type {
  RedisCreateOpts,
  RedisDeleteOpts,
  RedisExtend,
  RedisGetOpts,
  RedisMergeOpts,
  RedisUpdateOpts,
} from "./redis-types"

export const redisCreate = async <T extends Record<keyof T, unknown>>(props: RedisCreateOpts<T>) => {
  const randomId = nanoid()

  const key = props.idPrefix + "/" + (props.id ?? randomId)

  const payload = {
    ...props.payload,
    id: randomId,
    ttlSec: props.ttlSec,
  } satisfies RedisExtend<T>

  const response = await redisClient.set(key, JSON.stringify(payload), { ex: props.ttlSec })

  if (response === null) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisCreate" })

  return payload
}

export const redisGet = async <T>(props: RedisGetOpts): Promise<RedisExtend<T> | null> => {
  const key = props.idPrefix + "/" + props.id

  const data = await redisClient.get<T>(key)

  return data as RedisExtend<T>
}

export const redisUpdate = async <T extends Record<keyof T, unknown>>(props: RedisUpdateOpts<T>) => {
  const previous = await redisGet<T>({ id: props.id, idPrefix: props.idPrefix })

  if (!previous) {
    throw new ExtendedError({ code: "NOT_FOUND", message: "Record not found to update" })
  }

  const updatedPayload = {
    ...previous,
    ...props.payload,
    ttlSec: props.ttlSec ?? previous.ttlSec,
  } satisfies RedisExtend<T>

  const key = props.idPrefix + "/" + props.id

  const response = await redisClient.set(key, JSON.stringify(updatedPayload), { ex: props.ttlSec ?? previous.ttlSec })

  if (response === null) {
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisUpdate" })
  }

  return props.payload
}

export const redisMerge = async <T extends Record<keyof T, unknown>>(props: RedisMergeOpts<T>) => {
  const updatedPayload = {
    ...props.previous,
    ...props.payload,
    ttlSec: props.ttlSec ?? props.previous.ttlSec,
  } satisfies RedisExtend<T>

  const key = props.idPrefix + "/" + props.previous.id

  const response = await redisClient.set(key, JSON.stringify(updatedPayload), {
    ex: props.ttlSec ?? props.previous.ttlSec,
  })

  if (response === null) {
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisMerge" })
  }

  return props.payload
}

export const redisDelete = async (props: RedisDeleteOpts) => {
  const key = props.idPrefix + "/" + props.id

  const response = await redisClient.del(key)

  if (!response) {
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisDelete" })
  }
}

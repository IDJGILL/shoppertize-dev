import { nanoid } from "nanoid"
import { redisClient } from "./redis-client"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import type {
  RedisSetOpts,
  RedisDeleteOpts,
  RedisExtend,
  RedisGetOpts,
  RedisMergeOpts,
  RedisUpdateOpts,
  RedisHashSetOpts,
  RedisHashGetOpts,
  RedisHashGetAllOpts,
  RedisHashDeleteOpts,
  RedisHashDeleteAllOpts,
} from "./redis-types"
import { keyBy } from "lodash-es"

//
// String Methods
//

export const redisSet = async <T extends Record<keyof T, unknown>>(props: RedisSetOpts<T>) => {
  const randomId = nanoid()

  const key = props.idPrefix + "/" + (props.id ?? randomId)

  const payload = {
    ...props.payload,
    id: randomId,
    ttlSec: props.ttlSec,
  } satisfies RedisExtend<T>

  const response = await redisClient.set(key, JSON.stringify(payload), { ex: props.ttlSec! })

  if (response === null) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisSet" })

  return payload
}

export const redisGet = async <T>(props: RedisGetOpts) => {
  const key = props.idPrefix + "/" + props.id

  const response = await redisClient.get<T>(key)

  if (response === null) throw new ExtendedError({ code: "NOT_FOUND", message: `${props.id} not found` })

  return response as RedisExtend<T>
}

export const redisUpdate = async <T extends Record<keyof T, unknown>>(props: RedisUpdateOpts<T>) => {
  const previous = await redisGet<T>({ id: props.id, idPrefix: props.idPrefix })

  const updatedPayload = {
    ...previous,
    ...props.payload,
    ttlSec: props.ttlSec ?? previous.ttlSec,
  } satisfies RedisExtend<T>

  const key = props.idPrefix + "/" + props.id

  const response = await redisClient.set(key, JSON.stringify(updatedPayload), { ex: props.ttlSec! ?? previous.ttlSec })

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
    ex: props.ttlSec! ?? props.previous.ttlSec,
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

//
// Hash Methods
//

export const redisHashSet = async <T extends Record<string, unknown>[]>(props: RedisHashSetOpts<T>) => {
  const payload = keyBy(props.payload, props.key)

  const response = await redisClient.hset(props.id, payload)

  if (response === null) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisSet" })

  return payload
}

export const redisHashGet = async <TData>(props: RedisHashGetOpts) => {
  const response = await redisClient.hget<TData>(props.id, props.key)

  if (response === null) throw new ExtendedError({ code: "NOT_FOUND", message: `${props.key} not found` })

  return response
}

export const redisHashGetAll = async <TData extends Record<string, unknown>>(props: RedisHashGetAllOpts) => {
  const response = await redisClient.hgetall<Record<string, TData>>(props.id)

  if (response === null) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisSet" })

  return response
}

export const redisHashDelete = async (props: RedisHashDeleteOpts) => {
  const response = await redisClient.hdel(props.id, ...props.keys)

  if (response === 0) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisSet" })

  return response
}

export const redisHashDeleteAll = async (props: RedisHashDeleteAllOpts) => {
  const response = await redisClient.del(props.id)

  if (!response) {
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "redisDelete" })
  }
}

import type { RedisIDPrefix } from "~/vertex/global/global-types"

export type RedisExtend<T> = {
  id: string
  ttlSec?: number
} & T

export type RedisSetOpts<T> = {
  id?: string
  idPrefix: RedisIDPrefix
  payload: T
  ttlSec?: number
}

export type RedisGetOpts = {
  id: string
  idPrefix: RedisIDPrefix
}

export type RedisUpdateOpts<T> = {
  id: string
  idPrefix: RedisIDPrefix
  payload: Partial<T>
  ttlSec?: number
}

export type RedisMergeOpts<T> = {
  idPrefix: RedisIDPrefix
  payload: Partial<T>
  ttlSec?: number
  previous: RedisExtend<T>
}

export type RedisDeleteOpts = {
  id: string
  idPrefix: RedisIDPrefix
}

export type RedisHashSetOpts<T extends Record<string, unknown>[]> = {
  id: RedisIDPrefix
  payload: T
  key: keyof T[number]
}

export type RedisHashGetOpts = {
  id: RedisIDPrefix
  key: string
}

export type RedisHashGetAllOpts = {
  id: RedisIDPrefix
}

export type RedisHashDeleteOpts = {
  id: RedisIDPrefix
  keys: string[]
}

export type RedisHashDeleteAllOpts = {
  id: RedisIDPrefix
}

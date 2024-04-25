import type { RedisIDPrefix } from "~/vertex/global/types"

export type RedisExtend<T> = {
  id: string
  ttlSec: number
} & T

export type RedisCreateOpts<T> = {
  id?: string
  idPrefix: RedisIDPrefix
  payload: T
  ttlSec: number
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
  id: string
  idPrefix: RedisIDPrefix
  payload: Partial<T>
  ttlSec?: number
  previous: RedisExtend<T>
}

export type RedisDeleteOpts = {
  id: string
  idPrefix: RedisIDPrefix
}

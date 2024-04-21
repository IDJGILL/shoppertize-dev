type ReadOnlySearchParams = Record<string, string | string[] | undefined>
Record<string, string>

interface ServerComponentParams {
  params: Record<string, string>
  searchParams?: ReadOnlySearchParams
}

type NullableType<T> = T | null

type DynamicObject<TValue = unknown> = Record<string, TValue>

type RemoveNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

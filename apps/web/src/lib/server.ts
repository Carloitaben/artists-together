import "server-only"
import type { SafeParseReturnType, TypeOf, ZodTypeAny } from "zod"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { cookies } from "next/headers"

export function parseSearchParams<Schema extends ZodTypeAny>(
  params: ReadonlyURLSearchParams | URLSearchParams,
  schema: Schema,
): SafeParseReturnType<Schema, TypeOf<Schema>> {
  return schema.safeParse(
    params instanceof URLSearchParams
      ? Object.fromEntries(params.entries())
      : params,
  )
}

export function createCookie<Name extends string, Schema extends ZodTypeAny>(
  name: Name,
  schema: Schema,
  baseOptions?: Partial<ResponseCookie>,
) {
  return {
    has() {
      return cookies().has(name)
    },
    get(): SafeParseReturnType<Schema, TypeOf<Schema>> {
      const value = cookies().get(name)?.value || ""
      return schema.safeParse(JSON.parse(value))
    },
    getOrThrow(): TypeOf<Schema> {
      const value = cookies().get(name)?.value || ""
      return schema.parse(JSON.parse(value))
    },
    set(
      value: TypeOf<Schema>,
      options = baseOptions,
    ): SafeParseReturnType<Schema, TypeOf<Schema>> {
      const parsed = schema.safeParse(value)

      if (!parsed.success) {
        return parsed
      }

      cookies().set(name, JSON.stringify(parsed.data), options)

      return { success: true, data: value } as const
    },
    setOrThrow(value: TypeOf<Schema>, options = baseOptions): TypeOf<Schema> {
      const parsed = schema.parse(value)
      cookies().set(name, JSON.stringify(parsed), options)
      return parsed
    },
  }
}

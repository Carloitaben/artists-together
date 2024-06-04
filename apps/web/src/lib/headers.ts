import "server-only"
import { cache } from "react"
import { headers } from "next/headers"
import { z } from "zod"

export const saveData = cache(() => headers().get("Save-Data") === "on")

export const Geolocation = z
  .object({
    city: z.string(),
    country: z
      .string()
      .refine((value) => value !== "T1", { message: "Tor network" })
      .refine((value) => value !== "XX", { message: "Missing country code" }),
    continent: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    timezone: z.string(),
  })
  .nullable()

export type Geolocation = z.infer<typeof Geolocation>

export const getGeolocation = cache(() => {
  const headersStore = headers()

  const geolocation = Geolocation.safeParse({
    city: headersStore.get("x-vercel-ip-city"),
    country: headersStore.get("x-vercel-ip-country"),
    continent: headersStore.get("x-vercel-ip-continent"),
    latitude: headersStore.get("x-vercel-ip-latitude"),
    longitude: headersStore.get("x-vercel-ip-longitude"),
    timezone: headersStore.get("x-vercel-ip-timezone"),
  })

  if (!geolocation.success) {
    return null
  }

  return geolocation.data
})

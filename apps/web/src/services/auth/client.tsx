"use client"

import type { AuthenticateResult } from "@artists-together/auth"
import type { ReactNode } from "react"
import { createContext, use } from "react"

const context = createContext<AuthenticateResult | undefined>(undefined)

context.displayName = "AuthContext"

export function Provider({
  children,
  value,
}: {
  children: ReactNode
  value: AuthenticateResult
}) {
  return <context.Provider value={value}>{children}</context.Provider>
}

export function getAuth() {
  const value = use(context)

  if (!value) {
    throw Error(`Used ${context.displayName} outside provider`)
  }

  return value
}

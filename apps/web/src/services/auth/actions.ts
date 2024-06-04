"use server"

import { generateState, lucia, provider } from "@artists-together/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getGeolocation } from "~/lib/headers"
import { authenticate, oauthCookie } from "./server"
import { db, eq, users } from "@artists-together/db"

export async function login(pathname: string) {
  const auth = await authenticate()

  if (auth) {
    return {
      error: "You are already logged in",
    }
  }

  const geolocation = getGeolocation()
  const state = generateState()
  const url = await provider.discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  })

  oauthCookie.setOrThrow({
    geolocation,
    pathname,
    state,
  })

  return redirect(url.toString())
}

export async function logout() {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  await lucia.invalidateSession(auth.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
}

export async function connectDiscord(pathname: string) {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  const state = generateState()
  const url = await provider.discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"],
  })

  oauthCookie.setOrThrow({
    geolocation: null,
    pathname,
    state,
  })

  return redirect(url.toString())
}

export async function unlinkDiscord() {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  await db
    .update(users)
    .set({
      discordId: null,
      discordUsername: null,
      discordMetadata: null,
    })
    .where(eq(users.id, auth.user.id))
}

export async function connectTwitch(pathname: string) {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  const state = generateState()
  const url = await provider.twitch.createAuthorizationURL(state)

  oauthCookie.setOrThrow({
    geolocation: null,
    pathname,
    state,
  })

  return redirect(url.toString())
}

export async function unlinkTwitch() {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  await db
    .update(users)
    .set({
      twitchId: null,
      twitchUsername: null,
      twitchMetadata: null,
    })
    .where(eq(users.id, auth.user.id))
}

import { lucia, generateId, provider } from "@artists-together/auth"
import { dc, createDiscordClient, ROLES } from "@artists-together/core/discord"
import { db, locations, users } from "@artists-together/db"
import { isRedirectError } from "next/dist/client/components/redirect"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { parseSearchParams } from "~/lib/server"
import { oauthCookie } from "~/services/auth/server"

const searchParams = z.union([
  z.object({
    error: z.string(),
    error_description: z.string().optional(),
  }),
  z.object({
    code: z.string().min(1),
    state: z.string().min(1),
  }),
])

export async function GET(request: NextRequest) {
  const cookie = oauthCookie.get()

  if (!cookie.success) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing or invalid oauth cookie",
    })
  }

  const params = parseSearchParams(request.nextUrl.searchParams, searchParams)

  if (!params.success) {
    return redirect(`${cookie.data.pathname}?error`)
  }

  if ("error" in params.data) {
    switch (params.data.error) {
      case "access_denied":
        return redirect(`${cookie.data.pathname}?modal=auth`)
      default:
        return redirect(`${cookie.data.pathname}?error`)
    }
  }

  if (params.data.state !== cookie.data.state) {
    return redirect(`${cookie.data.pathname}?error`)
  }

  try {
    const tokens = await provider.discord.validateAuthorizationCode(
      params.data.code,
    )

    const discordUser = await createDiscordClient({
      authPrefix: "Bearer",
      token: tokens.accessToken,
    }).users.getCurrent(request)

    const discordGuildMember = await dc.guilds
      .getMember(String(process.env.DISCORD_SERVER_ID), discordUser.id)
      .catch(() => null)

    const shouldAddWebRole =
      discordGuildMember && !discordGuildMember.roles.includes(ROLES.WEB)

    const discordAvatarId = discordGuildMember?.avatar || discordUser.avatar

    // TODO: upload this to our R2 bucket
    const discordAvatar = discordAvatarId
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordAvatarId}`
      : null

    const user = await db
      .insert(users)
      .values({
        id: generateId(15),
        email: discordUser.email,
        avatar: discordAvatar,
        username: discordUser.username,
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordMetadata: discordUser,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          avatar: discordAvatar,
          discordId: discordUser.id,
          discordUsername: discordUser.username,
          discordMetadata: discordUser,
        },
      })
      .returning()
      .then(([value]) => value)

    if (!user) {
      return redirect(`${cookie.data.pathname}?error`)
    }

    const sessionCookiePromise = lucia
      .createSession(user.id, {})
      .then((session) => lucia.createSessionCookie(session.id))

    const maybeInsertGeolocationPromise =
      cookie.data.geolocation &&
      db
        .insert(locations)
        .values(cookie.data.geolocation)
        .onConflictDoNothing({ target: locations.city })
        .catch(console.error)

    const maybeAddDiscordRolePromise =
      shouldAddWebRole &&
      dc.guilds
        .addRoleToMember(
          String(process.env.DISCORD_SERVER_ID),
          discordUser.id,
          ROLES.WEB,
          { reason: "Linked Artists Together account" },
        )
        .catch(console.error)

    const [sessionCookie] = await Promise.all([
      sessionCookiePromise,
      maybeInsertGeolocationPromise,
      maybeAddDiscordRolePromise,
    ])

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return redirect(cookie.data.pathname)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    console.error(error)
    return redirect(`${cookie.data.pathname}?error`)
  }
}

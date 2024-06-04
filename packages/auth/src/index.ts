import type { SelectUser } from "@artists-together/db"
import { db, sessions, users } from "@artists-together/db"
import { WEB_URL } from "@artists-together/core/constants"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"
import type { Session, User } from "lucia"
import { Discord, Twitch } from "arctic"

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes) {
    return {
      username: attributes.username,
      avatar: attributes.avatar,
      email: attributes.email,
      bio: attributes.bio,
      discordId: attributes.discordId,
      discordUsername: attributes.discordUsername,
      twitchId: attributes.twitchId,
      twitchUsername: attributes.twitchUsername,
      settingsFullHourFormat: attributes.settingsFullHourFormat,
      settingsFahrenheit: attributes.settingsFahrenheit,
      settingsShareCursor: attributes.settingsShareCursor,
      settingsShareLocation: attributes.settingsShareLocation,
      settingsShareStreaming: attributes.settingsShareStreaming,
    } satisfies Partial<SelectUser>
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: SelectUser
  }
}

export const provider = {
  discord: new Discord(
    String(process.env.DISCORD_OAUTH_ID),
    String(process.env.DISCORD_OAUTH_SECRET),
    new URL("/api/auth/callback/discord", WEB_URL).toString()
  ),
  twitch: new Twitch(
    String(process.env.TWITCH_OAUTH_ID),
    String(process.env.TWITCH_OAUTH_SECRET),
    new URL("/api/auth/callback/twitch", WEB_URL).toString()
  ),
}

export type AuthenticateResult<Authenticated extends boolean = false> =
  Authenticated extends true
    ? {
        user: User
        session: Session
      }
    : {
        user: User
        session: Session
      } | null

export async function authenticate(
  request: Request
): Promise<AuthenticateResult> {
  const sessionId = lucia.readSessionCookie(request.headers.get("Cookie") ?? "")

  if (!sessionId) {
    return null
  }

  return lucia
    .validateSession(sessionId)
    .then((result) => (result.user && result.session ? result : null))
}

export * from "lucia"
export * from "arctic"

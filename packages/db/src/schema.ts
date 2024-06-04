import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import { z } from "zod"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const discordMetadata = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  global_name: z.string().nullable(),
  avatar: z.string().nullable(),
  bot: z.boolean().optional(),
  system: z.boolean().optional(),
  mfa_enabled: z.boolean().optional(),
  verified: z.boolean().optional(),
  email: z.string().optional().nullable(),
  flags: z.number().optional(),
  banner: z.string().optional().nullable(),
  accent_color: z.number().optional().nullable(),
  premium_type: z.number().optional(),
  public_flags: z.number().optional(),
  locale: z.string().optional(),
  avatar_decoration: z.string().optional().nullable(),
})

export type DiscordMetadata = z.infer<typeof discordMetadata>

export const twitchMetadata = z.object({
  id: z.string(),
  login: z.string(),
  display_name: z.string(),
  type: z
    .union([
      z.literal(""),
      z.literal("admin"),
      z.literal("staff"),
      z.literal("global_mod"),
    ])
    .transform((value) => value || null),
  broadcaster_type: z
    .union([z.literal(""), z.literal("affiliate"), z.literal("partner")])
    .transform((value) => value || null),
  description: z.string(),
  profile_image_url: z.string(),
  offline_image_url: z.string(),
  view_count: z.number(),
  email: z.string().optional(),
  created_at: z.string(),
})

export type TwitchMetadata = z.infer<typeof twitchMetadata>

export const users = sqliteTable(
  "users",
  {
    id: text("id").unique().primaryKey(),
    username: text("username").notNull().unique(),
    avatar: text("avatar"),
    email: text("email").unique(),
    bio: text("bio"),
    discordId: text("discord_id").unique(),
    discordUsername: text("discord_username").unique(),
    discordMetadata: text("discord_metadata", {
      mode: "json",
    }).$type<DiscordMetadata>(),
    twitchId: text("twitch_id").unique(),
    twitchUsername: text("twitch_username").unique(),
    twitchMetadata: text("twitch_metadata", {
      mode: "json",
    }).$type<TwitchMetadata>(),
    settingsFullHourFormat: integer("settings_full_hour_format", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    settingsShareLocation: integer("settings_share_location", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settingsShareStreaming: integer("settings_share_streaming", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settingsShareCursor: integer("settings_share_cursor", {
      mode: "boolean",
    })
      .notNull()
      .default(true),
    settingsFahrenheit: integer("settings_fahrenheit", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    discordIdx: index("discord_idx").on(table.discordId),
  })
)

export const usersRelations = relations(users, ({ many }) => ({
  contentShared: many(contentShared),
}))

export const InsertUser = createInsertSchema(users, {
  avatar: (schema) => schema.avatar.url(),
  email: (schema) => schema.email.email(),
  discordMetadata,
  twitchMetadata,
})

export const SelectUser = createSelectSchema(users, {
  avatar: (schema) => schema.avatar.url(),
  email: (schema) => schema.email.email(),
  discordMetadata,
  twitchMetadata,
})

export type InsertUser = typeof users.$inferInsert

export type SelectUser = typeof users.$inferSelect

export const contentShared = sqliteTable("content_shared", {
  url: text("url").unique().primaryKey(),
  userId: text("user_id").notNull(),
})

export const contentSharedRelations = relations(contentShared, ({ one }) => ({
  user: one(users, {
    fields: [contentShared.userId],
    references: [users.id],
  }),
}))

export const InsertContentShared = createInsertSchema(contentShared, {
  url: (schema) => schema.url.url(),
})

export const SelectContentShared = createSelectSchema(contentShared, {
  url: (schema) => schema.url.url(),
})

export type InsertContentShared = typeof contentShared.$inferInsert

export type SelectContentShared = typeof contentShared.$inferSelect

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
})

export type InsertSession = typeof sessions.$inferInsert

export type SelectSession = typeof sessions.$inferSelect

export const locations = sqliteTable("location", {
  city: text("city").unique().primaryKey(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  timezone: text("timezone").notNull(),
})

export const InsertLocation = createInsertSchema(locations)

export const SelectLocation = createSelectSchema(locations)

export type InsertLocation = typeof locations.$inferInsert

export type SelectLocation = typeof locations.$inferSelect

export const liveUsers = sqliteTable("live_users", {
  discordId: text("discord_id").primaryKey(),
  url: text("url").notNull(),
})

export const InsertLiveUser = createInsertSchema(liveUsers)

export const SelectLiveUser = createSelectSchema(liveUsers)

export type InsertLiveUser = typeof liveUsers.$inferInsert

export type SelectLiveUser = typeof liveUsers.$inferSelect

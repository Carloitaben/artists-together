import * as v from "valibot"
import { sqliteTable, text, index, int } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-valibot"
import { timestamp, timestamps } from "../types"

export const DiscordMetadata = v.object({
  id: v.string(),
  username: v.string(),
  discriminator: v.string(),
  global_name: v.nullable(v.string()),
  avatar: v.nullable(v.string()),
  bot: v.optional(v.boolean()),
  system: v.optional(v.boolean()),
  mfa_enabled: v.optional(v.boolean()),
  verified: v.optional(v.boolean()),
  email: v.nullable(v.pipe(v.string(), v.email())),
  flags: v.optional(v.number()),
  banner: v.optional(v.string()),
  accent_color: v.optional(v.number()),
  premium_type: v.optional(v.number()),
  public_flags: v.optional(v.number()),
  locale: v.optional(v.string()),
  avatar_decoration: v.optional(v.string()),
})

export type DiscordMetadata = v.InferOutput<typeof DiscordMetadata>

export const TwitchMetadata = v.object({
  id: v.string(),
  login: v.string(),
  display_name: v.string(),
  type: v.picklist(["", "admin", "staff", "global_mod"]),
  broadcaster_type: v.picklist(["", "affiliate", "partner"]),
  description: v.string(),
  profile_image_url: v.string(),
  offline_image_url: v.string(),
  view_count: v.number(),
  email: v.optional(v.string()),
  created_at: v.string(),
})

export type TwitchMetadata = v.InferOutput<typeof TwitchMetadata>

export const UserSettings = v.object({
  fullHourFormat: v.optional(v.boolean(), false),
  shareStreaming: v.optional(v.boolean(), true),
  shareCursor: v.optional(v.boolean(), true),
  fahrenheit: v.optional(v.boolean(), false),
})

export type UserSettings = v.InferOutput<typeof UserSettings>

export const userTable = sqliteTable(
  "user",
  {
    ...timestamps,
    id: int("id").primaryKey(),
    username: text().notNull().unique(),
    pronouns: text(),
    avatar: text(),
    email: text().unique(),
    bio: text(),
    discordId: text().unique(),
    discordUsername: text().unique(),
    discordMetadata: text({ mode: "json" }).$type<DiscordMetadata>(),
    twitchId: text().unique(),
    twitchUsername: text().unique(),
    twitchMetadata: text({ mode: "json" }).$type<TwitchMetadata>(),
    settings: text({ mode: "json" }).$type<UserSettings>(),
  },
  (table) => [
    index("username_idx").on(table.username),
    index("discord_idx").on(table.discordId),
  ],
)

export const UserTableInsert = createInsertSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export const UserTableSelect = createSelectSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export const UserTableUpdate = createUpdateSchema(userTable, {
  avatar: (schema) => v.pipe(schema, v.url()),
  email: (schema) => v.pipe(schema, v.email()),
  bio: (schema) => v.pipe(schema, v.maxLength(300)),
  discordMetadata: DiscordMetadata,
  twitchMetadata: TwitchMetadata,
})

export type User = typeof userTable.$inferSelect

export const userRelations = relations(userTable, ({ many }) => ({
  contentShared: many(contentSharedTable),
}))

export const liveUserTable = sqliteTable("live_user", {
  discordId: text()
    .notNull()
    .references(() => userTable.discordId, { onDelete: "cascade" }),
  url: text().notNull(),
})

export type LiveUser = typeof liveUserTable.$inferSelect

export const contentSharedTable = sqliteTable("content_shared", {
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  url: text().unique().primaryKey(),
})

export const contentSharedRelations = relations(
  contentSharedTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [contentSharedTable.userId],
      references: [userTable.id],
    }),
  }),
)

export type ContentShared = typeof contentSharedTable.$inferSelect

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp().notNull(),
})

export type Session = typeof sessionTable.$inferSelect

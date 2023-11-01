import { eq } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { users } from "./sql"
import { zod } from "../utils"
import { db } from "../db"

export const UsersInsertSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
})

export type UsersInsertSchema = z.infer<typeof UsersInsertSchema>

export const UsersSelectSchema = createSelectSchema(users, {
  email: (schema) => schema.email.email(),
})

export type UsersSelectSchema = z.infer<typeof UsersSelectSchema>

export type UsersInsert = typeof users.$inferInsert

export type UsersSelect = typeof users.$inferSelect

export const fromUsername = zod(
  UsersSelectSchema.shape.username,
  async (username) =>
    db.select().from(users).where(eq(users.username, username)).get()
)

export const fromEmail = zod(UsersSelectSchema.shape.email, async (email) =>
  db.select().from(users).where(eq(users.email, email)).get()
)

export const update = zod(
  UsersInsertSchema.partial().required({ id: true }),
  ({ id, ...user }) => db.update(users).set(user).where(eq(users.id, id)).run()
)
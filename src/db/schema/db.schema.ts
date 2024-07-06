import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  userId: uuid("user_id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }),
})

export type UserType = InferSelectModel<typeof users>
export type NewUserType = InferInsertModel<typeof users>

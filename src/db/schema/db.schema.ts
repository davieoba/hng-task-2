import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

const Users = pgTable("users", {
  userId: uuid("user_id").defaultRandom().primaryKey().unique(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }),
})

const Organizations = pgTable("organization", {
  orgId: uuid("org_id").defaultRandom().primaryKey().unique(),
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
})

const usersToOrganizations = pgTable("users_to_organizations", {
  userId: uuid("user_id")
    .notNull()
    .references(() => Users.userId),
  organizationId: uuid("org_id")
    .notNull()
    .references(() => Organizations.orgId),
})

const userRelations = relations(Users, ({ many }) => ({
  organizations: many(usersToOrganizations),
}))

const organizationsRelations = relations(Organizations, ({ many }) => ({
  users: many(usersToOrganizations),
}))

type UserType = InferSelectModel<typeof Users>
type NewUserType = InferInsertModel<typeof Users>
type OrgType = InferSelectModel<typeof Organizations>
type NewOrgType = InferInsertModel<typeof Organizations>
type UserToOrganization = InferSelectModel<typeof usersToOrganizations>
type NewUserToOrganization = InferInsertModel<typeof usersToOrganizations>

export {
  NewOrgType,
  NewUserToOrganization,
  NewUserType,
  Organizations,
  organizationsRelations,
  OrgType,
  userRelations,
  Users,
  usersToOrganizations,
  UserToOrganization,
  UserType,
}

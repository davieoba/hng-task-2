"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersToOrganizations = exports.Users = exports.userRelations = exports.organizationsRelations = exports.Organizations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const Users = (0, pg_core_1.pgTable)("users", {
    userId: (0, pg_core_1.uuid)("user_id").defaultRandom().primaryKey().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).unique().notNull(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 256 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 256 }).notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 256 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 256 }),
});
exports.Users = Users;
const Organizations = (0, pg_core_1.pgTable)("organization", {
    orgId: (0, pg_core_1.uuid)("org_id").defaultRandom().primaryKey().unique(),
    userId: (0, pg_core_1.uuid)("user_id").notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 256 }),
});
exports.Organizations = Organizations;
const usersToOrganizations = (0, pg_core_1.pgTable)("users_to_organizations", {
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => Users.userId),
    organizationId: (0, pg_core_1.uuid)("org_id")
        .notNull()
        .references(() => Organizations.orgId),
});
exports.usersToOrganizations = usersToOrganizations;
const userRelations = (0, drizzle_orm_1.relations)(Users, ({ many }) => ({
    organizations: many(usersToOrganizations),
}));
exports.userRelations = userRelations;
const organizationsRelations = (0, drizzle_orm_1.relations)(Organizations, ({ many }) => ({
    users: many(usersToOrganizations),
}));
exports.organizationsRelations = organizationsRelations;

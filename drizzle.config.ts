import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema/db.schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
    host: process.env.POSTGRES_HOST as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    database: process.env.POSTGRES_DB as string,
    ssl: false,
    port: 5432,
  },
  verbose: true,
  strict: true,
})

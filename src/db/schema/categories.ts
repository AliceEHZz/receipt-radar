import { serial, text, pgTable } from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
})

export type Category = typeof categories.$inferSelect
export type InsertCategorySchema = typeof categories.$inferInsert
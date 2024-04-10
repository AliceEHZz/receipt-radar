import { serial, text, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { expenses } from "./expenses";

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expenseId: integer("expense_id").references(() => expenses.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Receipt = typeof receipts.$inferSelect; // return type when queried
export type NewReceipt = typeof receipts.$inferInsert; // insert type

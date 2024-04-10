import {
  serial,
  text,
  numeric,
  pgTable,
  date,
  integer,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { categories } from "./categories";
import { users } from "./users";
import { receipts } from "./receipts";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
});

export const InsertExpenseSchema = createInsertSchema(expenses, {
  description: z.string().min(3).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
}).omit({ id: true, createdAt: true });

export type InsertExpenseSchema = z.infer<typeof InsertExpenseSchema>;

export type Expense = typeof expenses.$inferSelect;

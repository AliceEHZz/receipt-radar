import { db } from "@/db";
import { eq, sql } from "drizzle-orm";

import { expenses as expensesTable } from "@/db/schema/expenses";
import { categories as categoryTable } from "@/db/schema/categories";
import { receipts as receiptsTable } from "@/db/schema/receipts";

export const singleExpenseQuery = db
  .select({
    id: expensesTable.id,
    description: expensesTable.description,
    date: expensesTable.date,
    amount: expensesTable.amount,
    category: {
      id: categoryTable.id,
      name: categoryTable.name,
    },
    receipt: {
      id: receiptsTable.id,
      url: receiptsTable.url,
      width: receiptsTable.width,
      height: receiptsTable.height,
    },
  })
  .from(expensesTable)
  .innerJoin(categoryTable, eq(categoryTable.id, expensesTable.categoryId))
  .leftJoin(receiptsTable, eq(receiptsTable.expenseId, expensesTable.id))
  .where(eq(expensesTable.id, sql.placeholder("id")))
  .limit(1)
  .prepare("single_expense");

export type Expense = Awaited<ReturnType<typeof singleExpenseQuery.execute>>[0];

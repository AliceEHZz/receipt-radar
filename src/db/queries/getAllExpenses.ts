import { db } from "@/db";
import { eq, sql, desc } from "drizzle-orm";
import { users as usersTable } from "../schema/users";
import { expenses as expensesTable } from "../schema/expenses";
import { categories as categoryTable } from "../schema/categories";
import { receipts as receiptsTable } from "../schema/receipts";

const baseQuery = db
  .select({
    id: expensesTable.id,
    description: expensesTable.description,
    date: expensesTable.date,
    amount: expensesTable.amount,
    category: {
      id: categoryTable.id,
      name: categoryTable.name,
    },
    user: {
      id: usersTable.id,
      name: usersTable.name,
      image: usersTable.image,
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
  .innerJoin(usersTable, eq(usersTable.id, expensesTable.userId))
  .leftJoin(receiptsTable, eq(receiptsTable.expenseId, expensesTable.id));

export const expensesQuery = baseQuery
  .orderBy(desc(expensesTable.date))
  .prepare("expenses_for_dataTable");

export const userExpensesQuery = baseQuery
  .where(eq(usersTable.id, sql.placeholder("userId")))
  .orderBy(desc(expensesTable.date))
  .prepare("expenses_for_user");

export type Expense = Awaited<ReturnType<typeof expensesQuery.execute>>[0];

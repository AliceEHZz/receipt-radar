import { db } from "@/db";
import { sql } from "drizzle-orm";
import { expenses as expensesTable } from "@/db/schema/expenses";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { type Expense, userExpensesQuery } from "@/db/queries/getAllExpenses";
import { mightFail } from "might-fail";

export default async function Showexpenses({ userId }: { userId: string }) {
  const { result: userExpenses, error: getUserExpensesError } = await mightFail(
    userExpensesQuery.execute({ userId }).then((result) => result)
  );

  if (userExpenses === undefined || userExpenses.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Expenses Record</h2>
        <div>You have 0 expense on record. Start with adding an expense. </div>
      </div>
    );
  }

  if (getUserExpensesError) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Expenses Record</h2>
        <div>Could not get user expenses</div>
      </div>
    );
  }

  //! total amount only from user expenses.

  const { result: totalResults, error: totalError } = await mightFail(
    db
      .select({ total: sql<number>`sum(${expensesTable.amount})` })
      .from(expensesTable)
      .where(sql`${expensesTable.userId} = ${userId}`)
  );

  if (totalError) {
    console.error(totalError);
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Expenses</h2>
        <div>Could not get total expenses</div>
      </div>
    );
  }

  const totalExpense = totalResults[0]?.total;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-zinc-200 mb-10">
        Expense Records
      </h1>
      <h2 className="text-sm text-muted-foreground dark:text-zinc-200">
        Manage your expense.
      </h2>
      <DataTable columns={columns} data={userExpenses} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2 text-zinc-700 dark:text-zinc-200 mb-10">
          Total Expenses
        </h2>
        <p className="text-lg text-zinc-800 dark:text-zinc-300 font-semibold">
          ${totalExpense}
        </p>
      </div>
    </div>
  );
}
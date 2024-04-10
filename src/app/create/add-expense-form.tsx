import SubmitExpense from "./submit-expense";
// import "./globals.css";
import { db } from "@/db";
import { categories as categoriesTable } from "@/db/schema/categories";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default async function AddExpenseForm() {
  const categories = await db.select().from(categoriesTable);
  return <SubmitExpense categories={categories} />;
}

export function AddExpenseSkeleton() {
  return (
    <div>
      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Date */}
            <input
              type="date"
              disabled={true}
              className="mt-1 block w-full py-2 px-3 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg animate-pulse"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Description */}
            <input
              type="text"
              disabled={true}
              placeholder="Category"
              className="mt-1 block w-full py-2 px-3 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg animate-pulse"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Description */}
            <input
              type="text"
              disabled={true}
              placeholder="Description"
              className="mt-1 block w-full py-2 px-3 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg animate-pulse"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Amount */}
            <input
              type="number"
              disabled={true}
              placeholder="Amount"
              className="mt-1 block w-full py-2 px-3 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg animate-pulse"
            />
          </label>
        </div>
        <div>
          <Label
            htmlFor="receipt"
            className="block text-gray-700 dark:text-gray-300"
          >
            {/* Receipt */}
            <input
              id="receipt"
              name="receipt"
              type="file"
              accept="image/jpeg,image/png"
              placeholder="upload receipt"
              className="mt-1 block w-full py-2 px-3 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg animate-pulse"
            />
          </Label>
        </div>
        <Button
          type="submit"
          className={"w-full p-3 rounded-xl shadow animate-pulse"}
          disabled={true}
        >
          Add Expense
        </Button>
      </form>
    </div>
  );
}

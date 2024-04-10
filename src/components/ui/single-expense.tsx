import Image from "next/image";
import Link from "next/link";
import { type Expense } from "@/db/queries/singleExpense";
import DeleteExpense from "@/components/ui/delete-expense-btn";
import { Button } from "@/components/ui/button";

export default function SingleExpense({ expense }: { expense: Expense }) {
  function ExpenseReceipt() {
    if (!expense.receipt) {
      return (
        <div className="flex flex-col items-center justify-center gap-y-10">
          <div className="rounded-sm w-fill aspect-square relative overflow-hidden">
            <Image
              className="object-cover blur-sm"
              src={"http://placekitten.com/300/300"}
              alt="blank"
              width={400}
              height={400}
            />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg z-10">
              No Receipt Found
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-y-10">
        <Link href={expense.receipt.url}>
          <div className="rounded-sm w-fill aspect-square relative overflow-hidden">
            <Image
              className="object-cover"
              src={expense.receipt.url}
              alt={expense.description}
              width={400}
              height={400}
            />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:mx-40 md:mx-20">
      <div className="mb-10">
        <h1 className="text-3xl text-primary font-semibold">
          {expense.category.name} Expense on {expense.date}
        </h1>
      </div>
      {/* expense content */}
      <div className="flex flex-col justify-between gap-y-7 py-2">
        {/* expense receipt */}
        <div className="flex-shrink-0">
          <ExpenseReceipt />
        </div>
        {/* divider */}
        <div className="inline-block h-[] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
        {/* expense details */}
        <div className="flex flex-col gap-2">
          {/* expense data */}
          <div className="w-full text-lg">
            <div className="flex flex-row justify-between border-b mb-2">
              <p className="font-semibold">Amount:</p>
              <p>${expense.amount}</p>
            </div>
            <div className="flex flex-row justify-between border-b mb-2">
              <p className="font-semibold">Category:</p>
              <p>{expense.category.name}</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="font-semibold">Date:</p>
              <p>{expense.date}</p>
            </div>
          </div>
          {/* next actions */}
          <div className="flex flex-col">
            <div className="my-5">
              <h3 className="text-lg text-zinc-700 dark:text-zinc-200">
                Do you want to remove this expense?
              </h3>
            </div>
            <DeleteExpense expenseId={expense.id} />
            <p className="items-center text-center my-5">or</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

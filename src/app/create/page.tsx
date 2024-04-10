import AddExpenseForm, {
  AddExpenseSkeleton,
} from "@/app/create/add-expense-form";

import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default async function create() {
  return (
    <>
      <div className="flex justify-stretch h-fit max-w-full max-h-full">
        <div className="mx-auto h-fit w-2/3">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Add Your Expense
          </h1>
          <div className="mt-10">
            <Suspense fallback={<AddExpenseSkeleton />}>
              <AddExpenseForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

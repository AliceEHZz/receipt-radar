import SingleExpense from "@/components/ui/single-expense";
import { notFound } from "next/navigation";
import { singleExpenseQuery } from "@/db/queries/singleExpense";
import { mightFail } from "might-fail";

export default async function Expense({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  const { result: expense, error: getExpenseError } = await mightFail(
    singleExpenseQuery.execute({ id }).then((result) => result[0])
  );
  if (getExpenseError) {
    console.error(getExpenseError);
    return <div>error connecting to database</div>;
  }
  if (!expense) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <SingleExpense expense={expense} />
    </div>
  );
}

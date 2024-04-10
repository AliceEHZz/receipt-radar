"use client";

import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/app/(home)/actions";
import { twMerge } from "tailwind-merge";

import { useState } from "react";

export default function DeleteExpense({ expenseId }: { expenseId: number }) {
  const [deletionStatus, setDeletionStatus] = useState<
    "idle" | "deleting" | "success" | "error"
  >("idle");

  const handleDelete = async () => {
    try {
      setDeletionStatus("deleting");
      const result = await deleteExpense(expenseId);
      console.log({ result });
      setDeletionStatus("success");
    } catch (error) {
      console.error("Error deleting expense:", error);
      setDeletionStatus("error");
    }
  };

  return (
    <Button
      className={twMerge(
        "lg:inline-flex w-auto bg-white font-bold items-center justify-center text-red-600 border border-red-600 hover:bg-red-600 hover:text-white  dark:bg-transparent dark:hover:bg-red-600",
        deletionStatus === "deleting" && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleDelete}
      disabled={deletionStatus === "deleting"}
    >
      {deletionStatus === "deleting" ? "Deleting..." : "Delete"}
    </Button>
  );
}

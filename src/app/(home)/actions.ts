"use server";

import { db } from "@/db";

import { eq, sql } from "drizzle-orm";
import { expenses as expensesTable } from "@/db/schema/expenses";
import { receipts as receiptsTable } from "@/db/schema/receipts";
import { revalidatePath } from "next/cache";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { redirect } from "next/navigation";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteExpense(expenseId: number) {
  try {
    const deletedMedia = await db
      .delete(receiptsTable)
      .where(eq(receiptsTable.expenseId, expenseId))
      .returning()
      .then((res) => res[0]);

    await db
      .delete(expensesTable)
      .where(eq(expensesTable.id, expenseId))
      .returning();

    if (deletedMedia) {
      const url = deletedMedia.url;
      const key = url.split("/").slice(-1)[0];

      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    revalidatePath("/");
    redirect(`/`);
  } catch (e) {
    console.error(e);
  }
}

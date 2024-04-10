"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

import { db } from "@/db";
import { sql, eq, and } from "drizzle-orm";
import { expenses, InsertExpenseSchema } from "@/db/schema/expenses";
import { receipts as receiptsTable } from "@/db/schema/receipts";
import { auth } from "@/auth";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function createExpense({
  date,
  description,
  amount,
  userId,
  categoryId,
  fileId,
}: {
  date: string;
  description: string;
  amount: string;
  userId: string;
  categoryId: number;
  fileId?: number;
}): Promise<{ failure: string } | undefined> {
  const session = await auth();

  if (!session?.user?.id) {
    return { failure: "not logged in" };
  }

  if (fileId) {
    const result = await db
      .select({ id: receiptsTable.id })
      .from(receiptsTable)
      .where(
        and(
          eq(receiptsTable.id, fileId),
          eq(receiptsTable.userId, session.user.id)
        )
      )
      .then((rows) => rows[0]);

    if (!result) {
      return { failure: "image not found" };
    }
  }

  const results = await db
    .insert(expenses)
    .values({
      date,
      description,
      amount,
      categoryId,
      userId: session.user.id,
    })
    .returning();

  if (fileId) {
    await db
      .update(receiptsTable)
      .set({ expenseId: results[0].id })
      .where(eq(receiptsTable.id, fileId));
  }

  revalidatePath("/");
  redirect(`/`);
}

// *********handle S3 bucket file upload********

const maxFileSize = 1048576 * 10; // 1 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type SignedURLResponse = Promise<
  | { failure?: undefined; success: { url: string; id: number } }
  | { failure: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileSize: number;
  checksum: string;
};

export const getSignedURL = async ({
  fileSize,
  checksum,
}: GetSignedURLParams): SignedURLResponse => {
  const session = await auth();

  if (!session) {
    return { failure: "not logged in" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size too large" };
  }

  const fileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  console.log({ success: url });

  const results = await db
    .insert(receiptsTable)
    .values({
      url: url.split("?")[0],
      width: 0,
      height: 0,
      userId: session.user.id,
    })
    .returning();

  return { success: { url, id: results[0].id } };
};

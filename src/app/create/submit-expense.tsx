"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createExpense, getSignedURL } from "@/app/create/actions";

import { twMerge } from "tailwind-merge";
import { type Category } from "@/db/schema/categories";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SubmitExpense({
  categories,
}: {
  categories: Category[];
}) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>(categories[0]!);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleFileUpload = async (file: File) => {
    const signedURLResult = await getSignedURL({
      fileSize: file.size,
      checksum: await computeSHA256(file),
    });
    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure);
    }
    const { url, id: fileId } = signedURLResult.success;
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    const fileUrl = url.split("?")[0];
    return fileId;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileId: number | undefined = undefined;
      if (file) {
        setStatusMessage("Uploading...");
        fileId = await handleFileUpload(file);
      }

      setStatusMessage("Posting post...");

      const result = await createExpense({
        date,
        description,
        amount,
        userId: "",
        categoryId: category.id,
        fileId: fileId,
      });

      setStatusMessage("Add Expense Successful");
    } catch (error) {
      console.error(error);
      setStatusMessage("Add Expense failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const receipt = e.target.files?.[0] ?? null;
    setFile(receipt);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (receipt) {
      const url = URL.createObjectURL(receipt);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-6 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg hover:bg-blue-100/60 focus:bg-blue-100/60 dark:hover:bg-blue-900 dark:focus:bg-blue-900 focus:ring-3"
            />
          </label>
        </div>
        <div className="flex flex-col space-y-1.5">
          {/* Category */}
          <Select
            onValueChange={(value) => {
              const category = categories.find(
                (category) => category.id === Number(value)
              )!;
              setCategory(category);
            }}
          >
            <SelectTrigger className="mt-1 w-full p-5 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 dark:hover:bg-blue-900 dark:focus:bg-blue-900 focus:ring-0">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={"" + category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Description */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="mt-1 block w-full p-6 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg hover:bg-blue-100/60 focus:bg-blue-100/60 dark:hover:bg-blue-900 dark:focus:bg-blue-900 focus:ring-3"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            {/* Amount */}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="mt-1 block w-full p-6 border-none bg-gray-100 dark:bg-gray-900 h-11 rounded-xl shadow-lg hover:bg-blue-100/60 focus:bg-blue-100/60 dark:hover:bg-blue-900 dark:focus:bg-blue-900 focus:ring-3"
            />
          </label>
        </div>

        {previewUrl && file && (
          <div className="mt-4">
            {file.type.startsWith("image/") ? (
              <img src={previewUrl} alt="Selected file" />
            ) : null}
            <Button
              type="button"
              className="border rounded-xl px-4 py-2"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
            >
              Remove Receipt
            </Button>
          </div>
        )}
        <div>
          <h1>Attach Receipt (*Optional): Your Choice to Upload or Skip</h1>
        </div>
        <div>
          <Label
            htmlFor="receipt"
            className="block text-gray-700 dark:text-gray-300"
          ></Label>
          <Input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="w-full p-3 border-none bg-gray-100 dark:bg-gray-900 h-15 rounded-xl shadow-lg hover:bg-blue-100/60 focus:bg-blue-100/60 dark:hover:bg-blue-900 dark:focus:bg-blue-900 focus:ring-3"
            placeholder="upload receipt"
          />
        </div>
        <Button
          type="submit"
          className={twMerge(
            "w-full text-white p-5 shadow hover:bg-green-800 hover:scale-105 dark:hover:bg-green-100 dark:hover:text-primary"
          )}
        >
          {loading && "Loading"}
          {!loading && "Add Expense"}
        </Button>
      </form>
      <div className="my-4">
        {statusMessage && (
          <p className="border border-yellow-400 text-yellow-600 px-4 py-3 mb-4 rounded relative">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}

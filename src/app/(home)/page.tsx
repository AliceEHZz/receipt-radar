import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import SigninButton from "@/components/ui/signin-button";
import { signIn, signOut } from "@/auth";
import Showexpenses from "@/components/expense-datatable/show-expenses"; 
import SignoutButton from "@/components/ui/signout-button";

export default async function Home() {
  const session = await auth();
  function CheckSession() {
    if (session?.user) {
      return (
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-5">
            <h2 className="text-2xl">
              Hi, <span className="text-primary">{session.user.name}</span>
              👋
            </h2>
            <h1 className="text-5xl text-zinc-800 dark:text-zinc-200">
              Track Your Expenses Today with Receipt Radar
            </h1>
            <p className="text-lg text-foreground">
              Enter Expenses and Upload Receipts Seamlessly!
            </p>
          </div>
          <div className="flex place-content-between">
            <Button
              asChild
              className="text-lg border rounded-none hover:bg-green-800 hover:scale-110"
            >
              <Link href="/create">Add Your Expense</Link>
            </Button>

            <SignoutButton
              signOut={async () => {
                "use server";
                const result = await signOut({ redirectTo: "/" });
              }}
            />
          </div>
          <hr className="mt-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />

          <div>
            <Showexpenses userId={session?.user.id} />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-col gap-y-10">
          <h1 className="text-3xl text-primary">
            SIGN IN to Track Your Expenses with Receipt Radar Today!
          </h1>
          <div className="mt-10">
            <SigninButton
              signIn={async () => {
                "use server";
                redirect("/api/auth/signin?callbackUrl=/");
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <main className="flex flex-col mx-10">
      <CheckSession />
    </main>
  );
}

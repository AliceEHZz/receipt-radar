import "@/app/globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import SigninButton from "@/components/ui/signin-button";
import Showexpenses from "@/components/expense-datatable/show-expenses";

export default async function Home() {
  const session = await auth();
  function CheckSession() {
    if (session?.user) {
      return (
        <div className="flex flex-col gap-y-8">
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
            SIGN IN to View Your Expense Records.
          </h1>
          <div className="mt-10">
            <SigninButton
              signIn={async () => {
                "use server";
                redirect("/api/auth/signin?callbackUrl=/expense-record");
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

"use client";

import { Button, buttonVariants } from "./button";

export default function SignoutButton({ signOut }: { signOut: () => void }) {
  return (
    <Button
      className={
        buttonVariants({ variant: "outline" }) +
        "lg:inline-flex w-auto font-bold items-center justify-center hover:text-white hover:bg-red-600"
      }
      onClick={() => signOut()}
    >
      Log Out
    </Button>
  );
}

"use client";

import { Github } from "lucide-react";
import { Button } from "./button";

export default function SigninButton({ signIn }: { signIn: () => void }) {
  return (
    <Button onClick={() => signIn()} className="text-xl md hover:scale-110">
      <Github className="mr-2 h-6 w-6" /> Sign In with GitHub
    </Button>
  );
}

import { notFound, redirect } from "next/navigation";
import Profile from "../../components/ui/profile";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return (
    <>
      <Profile user={session.user} />
    </>
  );
}

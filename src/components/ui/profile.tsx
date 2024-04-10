import Image from "next/image";
import Link from "next/link";
import SignoutButton from "@/components/ui/signout-button";
import { signOut } from "@/auth";

export default async function Profile({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-10">
      <Link href={user.image || "https://www.gravatar.com/avatar/?d=mp"}>
        <Image
          src={user.image || "https://www.gravatar.com/avatar/?d=mp"}
          alt="Picture of the author"
          width={300}
          height={300}
          className="rounded-full"
        />
      </Link>
      <h1 className="text-4xl font-bold text-primary">{user.name}</h1>
      <div>Email: {user.email}</div>
      <SignoutButton
        signOut={async () => {
          "use server";
          const result = await signOut({ redirectTo: "/" });
          console.log(result);
        }}
      />
    </div>
  );
}

import Image from "next/image";

export default function NotFound() {
  return (
    <main className="text-center mt-10 text-xl flex flex-col justify-center items-center gap-y-5">
      <Image
        src="/image/Logo.png"
        alt="receipt-radar-logo"
        width={400}
        height={100}
      />
      <h1 className="text-xl font-bold text-destructive">404</h1>
      <p>Sorry 🙇🏽 Expense not found.</p>
      <p>Go back to home page by clicking the logo on top 👆</p>
    </main>
  );
}

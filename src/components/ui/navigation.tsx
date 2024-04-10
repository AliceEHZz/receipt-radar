"use client";
import Link from "next/link";
import "@/app/globals.css";
import Image from "next/image";
import { Button } from "./button";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className="shadow-md dark:shadow-green-900/40">
      <nav className="flex items-center flex-wrap p-3 w-full h-full justify-between">
        <Link
          className="inline-flex items-center p-2 mr-4 hover:scale-105"
          href="/"
        >
          <Image
            src="/image/Logo.png"
            alt="receipt-radar-logo"
            width={200}
            height={100}
          />
        </Link>
        <Button
          className="inline-flex p-3 hover:bg-green-700 rounded lg:hidden text-white ml-auto hover:text-white outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="red"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:w-auto lg:h-full`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center w-full items-start">
            <div className="text-green-600 font-bold items-center hover:text-green-900 dark:hover:text-foreground mx-10 hover:scale-110">
              <Link href="/">Home</Link>
            </div>
            <div className="text-green-600 font-bold items-center hover:text-green-900 dark:hover:text-foreground mx-10 hover:scale-110">
              <Link href="/expense-record">Expense Record</Link>
            </div>
            <div className="text-green-600 font-bold items-center hover:text-green-900 dark:hover:text-foreground mx-10 hover:scale-110">
              <Link href="/create">Add Expense</Link>
            </div>
            <div className="text-green-600 font-bold items-center hover:text-green-900 dark:hover:text-foreground mx-10 hover:scale-110">
              <Link href="/profile">Profile</Link>
            </div>
            <div className="text-green-600 font-bold items-center hover:text-green-900 dark:hover:text-foreground mx-10">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

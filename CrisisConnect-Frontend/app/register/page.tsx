"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function RegisterPage() {
  return (
  <>
    <Header title="Register" />

    <main className="mx-auto max-w-md px-6 py-10">
      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="mb-4 text-3xl font-bold">
          Register
        </h1>

        <p className="mb-6 text-muted-foreground">
          Choose the type of account you want to register.
        </p>

        <div className="space-y-3">
          <Link
            href="/ngo/register"
            className="block rounded-md bg-primary px-5 py-3 text-primary-foreground hover:opacity-90"
          >
            NGO
          </Link>

          <Link
            href="/volunteer/register"
            className="block rounded-md bg-primary px-5 py-3 text-primary-foreground hover:opacity-90"
          >
            Volunteer
          </Link>

          <Link
            href="/donor/register"
            className="block rounded-md bg-primary px-5 py-3 text-primary-foreground hover:opacity-90"
          >
            Donor
          </Link>
        </div>
      </div>
    </main>
  </>
);
}

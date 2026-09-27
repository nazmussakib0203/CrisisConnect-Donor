"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function DonorLoginPage() {
const [email, setEmail] = useState("");

useEffect(() => {
setEmail(localStorage.getItem("email") || "");
}, []);

return (
<> <Header title="Donor Login" />

  <main className="mx-auto max-w-md px-6 py-10">
    <div className="rounded-lg border border-border bg-card p-8 text-center shadow-md">
      <h1 className="mb-4 text-3xl font-bold">
        Donor Login
      </h1>

      <p className="mb-2 text-muted-foreground">
        Logged in as:
      </p>

      <p className="font-medium text-foreground">
        {email}
      </p>
    </div>
  </main>
</>
);
}

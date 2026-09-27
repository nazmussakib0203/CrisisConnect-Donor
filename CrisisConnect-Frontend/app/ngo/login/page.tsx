"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";

export default function NgoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.replace("/login");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  return (
    <>
      <Header title="Verify Login" />

      <p>Enter the login code emailed to {email}.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/verify-login-otp",
              { email, code },
            );
            localStorage.setItem("token", response.data.accessToken);
            setError("");
            router.push("/ngo/dashboard");
          } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              setError(Array.isArray(message) ? message[0] : message);
            } else {
              setError("Verification failed");
            }
          }
        }}
        className="flex max-w-sm flex-col gap-2"
      >
        <div>
          <label htmlFor="code">Login Code</label>
          <input
            type="text"
            id="code"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Verify
        </button>
      </form>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
  <>
    <Header title="Login" />

    <main className="mx-auto max-w-md px-6 py-10">
      <div className="rounded-lg border border-border bg-card p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold">
          Login
        </h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const result = loginSchema.safeParse({ email, password });

            if (!result.success) {
              setError(result.error.issues[0].message);
              return;
            }

            try {
              const roleResponse = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/role",
                { params: { email } },
              );

              const role = roleResponse.data.role.toLowerCase();

              const loginResponse = await axios.post(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/" + role + "/login",
                { email, password },
              );

              console.log("DONOR LOGIN RESPONSE:", loginResponse.data);

              setError("");

              if (loginResponse.data.accessToken) {
                localStorage.setItem("token", loginResponse.data.accessToken);
                localStorage.setItem("email", email);
                router.push("/" + role + "/dashboard");
              } else {
                localStorage.setItem("email", email);
                router.push("/" + role + "/login");
              }
            } catch (err: any) {
              if (
                err.response &&
                err.response.data &&
                err.response.data.message
              ) {
                const message = err.response.data.message;
                setError(Array.isArray(message) ? message[0] : message);
              } else {
                setError("Login failed");
              }
            }
          }}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  </>
);
}

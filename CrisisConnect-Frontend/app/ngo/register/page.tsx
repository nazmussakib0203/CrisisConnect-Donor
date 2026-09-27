"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import Header from "@/components/Header";

const registerSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  phone: z.string().length(11, "Phone number must be 11 digits"),
  city: z.string().min(1, "City is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export default function NgoRegisterPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <Header title="NGO Registration" />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const result = registerSchema.safeParse({
            orgName,
            regNumber,
            phone,
            city,
            email,
            password,
            confirmPassword,
          });

          if (!result.success) {
            setError(result.error.issues[0].message);
            return;
          }

          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }

          try {
            await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/signup",
              { orgName, regNumber, phone, city, email, password },
            );
            localStorage.setItem("email", email);
            setError("");
            router.push("/ngo/verify-signup");
          } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
              const message = err.response.data.message;
              setError(Array.isArray(message) ? message[0] : message);
            } else {
              setError("Registration failed");
            }
          }
        }}
        className="flex max-w-sm flex-col gap-2"
      >
        <div>
          <label htmlFor="orgName">Organization Name</label>
          <input
            type="text"
            id="orgName"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="regNumber">Registration Number</label>
          <input
            type="text"
            id="regNumber"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Register
        </button>
      </form>
    </>
  );
}

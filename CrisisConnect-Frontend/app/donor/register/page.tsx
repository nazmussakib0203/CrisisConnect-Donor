"use client"
import * as z from "zod";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import Header from "@/components/Header";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z.object({
    fullName: z.string().min(6),
    email: z.email(),
    password: z.string().min(6),
    city: z.string().min(6),
    country: z.string().optional(),
    uniqueId: z.string().optional(),
});
export default function UserRegistration(){
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [error,setError] = useState('');

     function HandleSubmit (e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const data = { fullName, email, password, city, country, uniqueId };
        
        const result = schema.safeParse(data);
        if(!result.success){
            console.log(result.error.issues);
            setError("Insert valid credentials");
            return;
        }
        setError("");
        console.log("Valid Data:", result.data);
        createDonor();

    };

    async function createDonor(){
        try{
            const userData = {email,fullName,password,city,country,uniqueId};
            console.log("Sending:", userData);
            const response = await axios.post('http://localhost:3000/donor/signup',userData);
            console.log(response);
            
            localStorage.setItem('email', email);
            router.push('/donor/register/verify');
        }catch (error:any) {
            console.error(error);
            const message = error?.response?.data?.message || "Registration failed.";
            setError(message);
        }
    }
    return (
  <>
    <Header title="Registration" />

    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-lg border border-border bg-card p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold">
          Create Donor Account
        </h1>

        <form onSubmit={HandleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              City
            </label>

            <input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Country
            </label>

            <input
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Unique ID
            </label>

            <input
              name="uniqueId"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </main>
  </>
);
}
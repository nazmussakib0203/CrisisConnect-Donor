"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import * as z from "zod";

const schema = z.object ({
        fullName: z.string().min(6),
        city: z.string().min(6),
        country: z.string().optional(),
})
export default function EditProfile() {
    const [donorData, setDonorData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    async function getDonorProfile() {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No token found");
            return;
        }
        const response = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setDonorData(response.data);
    }
    async function handleEditProfile(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fullName = formData.get("fullName");
        const city = formData.get("city");
        const country = formData.get("country");

        const data = {fullName,city,country};
        const result = schema.safeParse(data);
        if(!result.success){
            console.log(result.error.issues);
            setError("Fill up all the fields with valid credentials");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found");
            return;
        }
        const updatedData = { fullName, city, country };
        try {
            const response = await axios.put(process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/profile", updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Profile updated successfully:", response.data);
            setError("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Error updating profile");
        }
}

    useEffect(() => {
        getDonorProfile();
    }, []);
    return (
  <main className="mx-auto max-w-2xl px-6 py-10">
    <div className="rounded-lg border border-border bg-card p-8 shadow-md">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Profile
      </h1>

      <form onSubmit={handleEditProfile} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            defaultValue={donorData?.fullName}
            className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City
          </label>

          <input
            type="text"
            name="city"
            defaultValue={donorData?.city}
            className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Country
          </label>

          <input
            type="text"
            name="country"
            defaultValue={donorData?.country}
            className="w-full rounded-md border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
        >
          Save Changes
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  </main>
);
        
}
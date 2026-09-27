"use client";
import axios from "axios";
import * as z from "zod";
import React from "react";
import { useRouter } from "next/navigation";

const donationSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    message: z.string().optional(),
});

export default function DonateForm({ donationCallId }: { donationCallId: number }) {
    const [error, setError] = React.useState("");
    const router = useRouter();

    async function handleDonate(e: React.SubmitEvent<HTMLFormElement>) {
    try{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const amount = formData.get("amount");
        const message = formData.get("message");
        const donationData = { donationCallId, amount, message};

        const result = donationSchema.safeParse(donationData);
        if(!result.success){
            console.log(result.error.issues);
            setError(result.error.issues[0].message);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found");
            return;
        }
        const response = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/donation", donationData,
            {headers: {Authorization: `Bearer ${token}`}});

        console.log("Donation Response:", response.data);
        setError(response.data.message);

        const donationId = response.data.donationId;
        localStorage.setItem("donationId",donationId.toString());
        router.push('/payment/');
    } catch (error) {
        console.error("Error occurred while processing donation:", error);
    }

}
    return (
  <form
    onSubmit={handleDonate}
    className="space-y-5"
  >
    <div>
      <label
        className="mb-2 block text-sm font-medium text-foreground"
      >
        Amount
      </label>

      <input
        type="number"
        name="amount"
        placeholder="Enter donation amount"
        className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div>
      <label
        className="mb-2 block text-sm font-medium text-foreground"
      >
        Message
      </label>

      <input
        type="text"
        name="message"
        placeholder="Optional message"
        className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <button
      type="submit"
      className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
      >
      Donate
    </button>

    {error && (
      <p className="text-sm text-destructive">
        {error}
      </p>
    )}
  </form>
);
  }
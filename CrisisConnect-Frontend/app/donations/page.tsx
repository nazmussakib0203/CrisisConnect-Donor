"use client";
import axios from "axios";
import { useEffect, useState } from "react";
export default function DonationsPage() {
    const [donations, setDonations] = useState<any>(null);

    async function getDonorDonations() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found");
            return;
        }
        try {

        const response = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/donation", {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
        setDonations(response.data);
    }catch (error) {
        console.error("Error fetching donations:", error);
    }
}
    useEffect(() => {
        getDonorDonations();
    }, []);

    async function handleDeleteDonation(donationId: number) {
        const token = localStorage.getItem("token");

        const response = await axios.delete(process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/donation/" + donationId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Delete Response:", response.data);
        getDonorDonations();
    }
    
  return (
  <main className="mx-auto max-w-6xl px-6 py-10">
    <h1 className="mb-3 text-3xl font-bold">
      My Donations
    </h1>

    <p className="mb-8 text-muted-foreground">
      View and manage your donations.
    </p>

    {donations && donations.length > 0 ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation: any) => (
          <div
            key={donation.id}
            className="rounded-lg border border-border bg-card p-6 shadow-md"
          >
            <div className="space-y-3 text-sm">
              <label className="block font-semibold">
                Amount: {donation.amount}
              </label>

              <label className="block font-semibold">
                Message: {donation.message || "No message"}
              </label>

              <label className="block font-semibold">
                Status: {donation.status}
              </label>

              <label className="block font-semibold">
                Created At: {donation.createdAt}
              </label>

              <label className="block font-semibold">
                Payment: {donation.payment || "Not available"}
              </label>
            </div>

            <button
              onClick={() => handleDeleteDonation(donation.id)}
              className="mt-5 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">
        You have not made any donations yet.
      </p>
    )}
  </main>
);
}

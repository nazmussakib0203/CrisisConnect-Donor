"use client";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DonorDashboardPage() {
  const [donorData, setDonorData] = useState<any>(null);

  async function getDonorData() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DONOR PROFILE:", response.data);
      setDonorData(response.data);
    } catch (error) {
      console.error("Error fetching donor data:", error);
    }
  }

  useEffect(() => {
    getDonorData();
  }, []);

  return (
    <>
      <Header title="Dashboard" />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Donor Dashboard
        </h1>

        {donorData && (
          <div className="rounded-lg border border-border bg-card p-8 shadow-md">
            <h2 className="mb-6 text-xl font-semibold">
              Donor Profile
            </h2>

            <div className="space-y-4">
              <label className="block font-semibold">
                Full Name: {donorData.fullName}
              </label>

              <label className="block font-semibold">
                City: {donorData.city}
              </label>

              <label className="block font-semibold">
                Country: {donorData.country}
              </label>

              <label className="block font-semibold">
                Joining Date: {donorData.joiningDate}
              </label>

              <label className="block font-semibold">
                Unique ID: {donorData.uniqueId}
              </label>

              <label className="block font-semibold">
                Image: {donorData.profileImage}
              </label>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/campaigns"
            className="inline-block rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Donation Campaigns
          </Link>
          <Link
            href="/donations"
            className="inline-block rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            My Donations
          </Link>
          <Link
            href="/profile/edit"
            className="inline-block rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Edit Profile
          </Link>
        </div>
      </main>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../../_components/statusColor";

export default function DonationCallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [donationCall, setDonationCall] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const callsResponse = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/donation-call",
        { headers: { Authorization: "Bearer " + token } },
      );
      const match = callsResponse.data.find((call: any) => String(call.id) === params.id);
      setDonationCall(match || null);

      const donationsResponse = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/donation-call/" + params.id + "/donations",
        { headers: { Authorization: "Bearer " + token } },
      );
      setDonations(donationsResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Donation Call" />

      {donationCall != null && (
        <Card className="mb-6 max-w-sm">
          <CardHeader>
            <CardTitle>{donationCall.title}</CardTitle>
            <CardDescription>{donationCall.raisedAmount} / {donationCall.targetAmount} raised</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className={statusColor(donationCall.status)}>{donationCall.status}</Badge>
          </CardContent>
        </Card>
      )}

      <h2 className="mb-2 text-lg font-semibold">Donations</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{donation.donor.fullName}</CardTitle>
              <CardDescription>{donation.donor.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Amount: {donation.amount}</p>
              {donation.message && <p className="mt-1 text-sm">"{donation.message}"</p>}
              <Badge className={"mt-2 " + statusColor(donation.status)}>{donation.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

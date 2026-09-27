import axios from "axios";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { notFound } from "next/navigation";
import DonateForm from "./donateForm";
import CampaignCard from "@/components/CampaignCard";

export default async function CampaignsById({
  params,
}: {
  params: Promise<{Id: string }>;
}) {
  const { Id } = await params;

  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/donation-call"
  );

  const campaigns = response.data;

  const campaign = campaigns.find(
    (item: any) => item.id === Number(Id)
  );

  if (!campaign) {
    notFound();
  }


  return (
  <>
    <Header title="Campaigns" />

    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Campaign Details
      </h1>

      <CampaignCard campaign={campaign} />

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Make a Donation
        </h2>

        <DonateForm donationCallId={campaign.id} />
      </div>
    </main>
  </>
);
}
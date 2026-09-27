import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import axios from "axios";
import CampaignCard from "@/components/CampaignCard";

export default async function campaigns() {

    const response = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + '/donor/donation-call');
    const campaigns = response.data;

     return (
    <>
      <Header title="Campaigns" />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Donation Campaigns
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
            />
          ))}
        </div>
      </main>
    </>
  );
}
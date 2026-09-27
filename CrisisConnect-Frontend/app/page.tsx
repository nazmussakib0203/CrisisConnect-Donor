import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import axios from "axios";
import Link from "next/link";
import CampaignCarousel from "@/components/CampaignCarousel";

export default async function Home() {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/donor/donation-call"
      );
      const campaigns = response.data;
      console.log("All Campaigns:", campaigns);

      const openCampaigns = campaigns.filter((campaign: any) => campaign.status === "OPEN");
  return (
  <>
    <Header title="Home" />

    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Welcome to CrisisConnect
        </h1>

        <p className="text-muted-foreground">
          Help communities affected by crises through meaningful donations.
        </p>
      </div>

      <div>
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Donation Campaigns
        </h2>

        <CampaignCarousel
          campaigns={openCampaigns.slice(0, 3)}
        />
      </div>
    </main>
  </>
);
  }catch (error) {
    console.error("Error fetching campaigns:", error);
  }

}

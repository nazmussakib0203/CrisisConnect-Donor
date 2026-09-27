"use client";
import { useState } from "react";
import CampaignCard from "./CampaignCard";
import Link from "next/link";

export default function CampaignCarousel({ campaigns }: { campaigns: any[] }) 
{
    const [currentIndex, setCurrentIndex] = useState(0);

    function nextCampaign() {
    setCurrentIndex((currentIndex + 1) % campaigns.length);
  }

  function previousCampaign() {
    setCurrentIndex(
      (currentIndex - 1 + campaigns.length) % campaigns.length
    );
  }

    return (
  <div className="mx-auto max-w-2xl">
    <CampaignCard campaign={campaigns[currentIndex]} />

    <div className="mt-4 flex items-center justify-center gap-4">
  <button
    onClick={previousCampaign}
    className="h-10 rounded-md border border-border bg-secondary px-4 text-secondary-foreground hover:bg-accent"
  >
    Previous
  </button>

  <button
    onClick={nextCampaign}
    className="h-10 rounded-md bg-primary px-4 text-primary-foreground hover:opacity-90"
  >
    Next
  </button>

  <Link
  href="/campaigns"
  className="flex h-10 translate-y-1 items-center rounded-md bg-primary px-4 text-primary-foreground hover:opacity-90"
>
  View All Campaigns
</Link>
</div>

  </div>
);
}

import Link from "next/link";

export default function CampaignCard({ campaign }: { campaign: any }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-md">
  <h2 className="mb-3 text-xl font-semibold text-foreground">
    {campaign.title}
  </h2>

  <label className="mb-4 block text-muted-foreground">
    {campaign.description}
  </label>

  <div className="space-y-2 text-sm">
    <label className="block font-semibold">
      Target Amount: {campaign.targetAmount}
    </label>

    <label className="block font-semibold">
      Raised Amount: {campaign.raisedAmount}
    </label>

    <label className="block font-semibold">
      Status: {campaign.status}
    </label>

    <label className="block font-semibold">
      Created At: {campaign.createdAt}
    </label>
  </div>

  <Link
    href={`/campaigns/${campaign.id}`}
    className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
  >
    View Campaign
  </Link>
</div>
  );
}
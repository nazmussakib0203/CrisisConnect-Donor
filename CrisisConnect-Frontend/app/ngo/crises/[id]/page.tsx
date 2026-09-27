import axios from "axios";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import JoinButton from "./JoinButton";

export default async function CrisisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis",
  );
  const crises = Array.isArray(response.data) ? response.data : [];
  const crisis = crises.find((item) => String(item.id) === id);

  if (!crisis) {
    notFound();
  }

  return (
    <>
      <Header title={crisis.title} />
      <p>{crisis.description}</p>
      <p>Category: {crisis.category}</p>
      <p>Severity: {crisis.severity}</p>
      <p>Status: {crisis.status}</p>
      <p>City: {crisis.city}</p>
      <JoinButton crisisId={crisis.id} />
    </>
  );
}

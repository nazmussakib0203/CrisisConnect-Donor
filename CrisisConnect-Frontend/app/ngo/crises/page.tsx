import axios from "axios";
import Header from "@/components/Header";
import CrisisCard from "../_components/CrisisCard";

export default async function CrisesPage() {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis",
  );
  const crises = Array.isArray(response.data) ? response.data : [];

  return (
    <>
      <Header title="All Crises" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crises.map((crisis, index) => (
          <CrisisCard key={index} crisis={crisis} />
        ))}
      </div>
    </>
  );
}

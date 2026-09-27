import axios from "axios";
import Header from "@/components/Header";
import Carousel from "./_components/Carousel";

export default async function NgoHomePage() {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/crisis",
    { params: { status: "ACTIVE" } },
  );
  const crises = Array.isArray(response.data) ? response.data.slice(0, 3) : [];

  return (
    <>
      <Header title="Active Crises" />
      <Carousel crises={crises} />
    </>
  );
}

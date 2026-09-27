import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import axios from "axios";
export default async function getAllDonors() {

    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + '/donor/');
        const donors = response.data;
        console.log("All Donors:", donors);
    
    return (
  <>
    <Header title="All Donors" />

    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Our Donors
      </h1>

      {donors && donors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor: any) => (
            <div
              key={donor.id}
              className="rounded-lg border border-border bg-card p-6 shadow-md"
            >
              <div className="space-y-3">
                <label className="block font-semibold">
                  Full Name: {donor.fullName}
                </label>

                <label className="block font-semibold">
                  City: {donor.city}
                </label>

                <label className="block font-semibold">
                  Country: {donor.country}
                </label>

                <label className="block font-semibold">
                  Joining Date: {donor.joiningDate}
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No donors found.
        </p>
      )}
    </main>
  </>
);
    } catch (error) {
        console.error("Error fetching donors:", error);
    }
}
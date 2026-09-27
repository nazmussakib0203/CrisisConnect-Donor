"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "../_components/statusColor";

export default function VolunteerCallsPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<any[]>([]);
  const [joinedCrises, setJoinedCrises] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState("");
  const [city, setCity] = useState("");
  const [crisisId, setCrisisId] = useState("");
  const [error, setError] = useState("");

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
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/volunteer-call",
        { headers: { Authorization: "Bearer " + token } },
      );
      setCalls(response.data);

      const myCrisesResponse = await axios.get(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/my-crises",
        { headers: { Authorization: "Bearer " + token } },
      );
      setJoinedCrises(myCrisesResponse.data.crises);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header title="Volunteer Calls" />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const token = localStorage.getItem("token");
            await axios.post(
              process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/volunteer-call",
              {
                title,
                description,
                slots: Number(slots),
                city,
                crisisId: Number(crisisId),
              },
              { headers: { Authorization: "Bearer " + token } },
            );
            setTitle("");
            setDescription("");
            setSlots("");
            setCity("");
            setCrisisId("");
            setError("");
            fetchData();
          } catch (err: any) {
            const message = err.response && err.response.data && err.response.data.message;
            setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
          }
        }}
        className="mb-6 flex max-w-sm flex-col gap-2"
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="slots">Slots</label>
          <input
            id="slots"
            type="number"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="crisisId">Crisis</label>
          <select
            id="crisisId"
            className="w-full rounded border border-slate-300 px-2 py-1"
            value={crisisId}
            onChange={(e) => setCrisisId(e.target.value)}
          >
            <option value="">Select a crisis you've joined</option>
            {joinedCrises.map((crisis, index) => (
              <option key={index} value={crisis.id}>{crisis.title}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Create Call
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calls.map((call, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{call.title}</CardTitle>
              <CardDescription>{call.city} · {call.slots} slots</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className={statusColor(call.status)}>{call.status}</Badge>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              {call.status === "OPEN" && (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.patch(
                        process.env.NEXT_PUBLIC_API_ENDPOINT + "/ngo/volunteer-call/" + call.id + "/status",
                        { status: "CLOSED" },
                        { headers: { Authorization: "Bearer " + token } },
                      );
                      fetchData();
                    } catch (err: any) {
                      const message = err.response && err.response.data && err.response.data.message;
                      setError(Array.isArray(message) ? message[0] : message || "Something went wrong");
                    }
                  }}
                >
                  Close
                </Button>
              )}
              <Button variant="link" className="px-0" nativeButton={false} render={<Link href={"/ngo/calls/" + call.id} />}>
                View Applicants
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
